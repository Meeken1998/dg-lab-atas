import asyncio
import io
import json
import qrcode
import os
import aiofiles
from pulses import PULSE_DATA
from pydglab_ws import (
    StrengthData,
    Channel,
    StrengthOperationType,
    RetCode,
    DGLabWSServer,
)
import psutil
import socket
import websockets
from settings import PUNISHMENT_SETTINGS, set_settings
import time
import datetime


def get_lan_ip():
    for _, addrs in psutil.net_if_addrs().items():
        for addr in addrs:
            if addr.family == socket.AF_INET and not addr.address.startswith("127."):
                return addr.address
    return None


CONFIG = {
    "LOG_FILE_PATH": "C:\\trade.txt",
    "WS_URL": f"ws://{get_lan_ip()}:5678",  # ws://{your_ip}:5678
}

P_SETTINGS = PUNISHMENT_SETTINGS.copy()
P_LATEST_PNL = 0
P_STOP_LOSS_COUNT = 0
P_NEXT_TIMESTAMP_ALLOWED_TO_TRADE = 0
P_IS_UNDER_PUNISHMENT = False
P_PUNISHMENT_COUNT = 0

current_websocket = None

print(f"Server 配置：{CONFIG}")
print(f"当前惩罚设置: {P_SETTINGS}")


def gen_qrcode(data: str):
    # Generate and print the QR code in ASCII format
    qr = qrcode.QRCode()
    qr.add_data(data)
    f = io.StringIO()
    qr.print_ascii(out=f)
    with open("qrcode.png", "wb") as fs:
        qr.make_image(fill_color="black", back_color="white").save(fs)
    f.seek(0)
    # 将二维码写到根目录 qrcode.png

    print(f.read())


async def handle_position_data(data):
    global P_LATEST_PNL
    global P_STOP_LOSS_COUNT
    global P_NEXT_TIMESTAMP_ALLOWED_TO_TRADE
    global P_IS_UNDER_PUNISHMENT
    global P_PUNISHMENT_COUNT

    if not client:
        return
    pnl, close = data.get("data"), data.get("close")

    # monitor trade info
    if close:
        if P_LATEST_PNL < 0:
            P_STOP_LOSS_COUNT += 1
        else:
            P_STOP_LOSS_COUNT = 0

    if P_STOP_LOSS_COUNT == P_SETTINGS["stopLoss"]["trigger"]:
        P_NEXT_TIMESTAMP_ALLOWED_TO_TRADE = (
            time.time() + P_SETTINGS["stopLossRestMinutes"] * 60
        )

    P_LATEST_PNL = pnl

    # Apply strength based on PNL
    strength = 0

    if (
        P_SETTINGS["stopLossEnabled"] == True
        and P_NEXT_TIMESTAMP_ALLOWED_TO_TRADE > time.time()
        and pnl < 0
    ):
        strength += (
            P_SETTINGS["stopLoss"]["value"]
            if P_SETTINGS["stopLoss"]["type"] == "fixed"
            else P_SETTINGS["stopLoss"]["value"] * abs(pnl)
        )
        print(
            f"🔒 触发连损风控，已连损 {P_STOP_LOSS_COUNT} 次，解除时间：{datetime.datetime.fromtimestamp(P_NEXT_TIMESTAMP_ALLOWED_TO_TRADE)}"
        )
    elif (
        P_SETTINGS["pnlLossEnabled"] == True
        and pnl < P_SETTINGS["pnlLoss"]["trigger"] * -1
    ):
        strength += (
            P_SETTINGS["pnlLoss"]["value"]
            if P_SETTINGS["pnlLoss"]["type"] == "fixed"
            else P_SETTINGS["pnlLoss"]["value"] * abs(pnl)
        )
        print(f"😡 触发扛单风控，已连损 {P_STOP_LOSS_COUNT} 次，当前 PnL：{pnl}")

    strength = round(strength)

    if strength > 0:
        if P_IS_UNDER_PUNISHMENT == False:
            P_IS_UNDER_PUNISHMENT = True
            P_PUNISHMENT_COUNT += 1
    else:
        P_IS_UNDER_PUNISHMENT = False

    print(f"⚡ 当前电击强度：{strength}")

    # Send pulses to the client
    await client.add_pulses(Channel.A, *(PULSE_DATA[P_SETTINGS["waveform"]] * 5))
    await client.set_strength(Channel.A, StrengthOperationType.SET_TO, strength)
    if current_websocket:
        await current_websocket.send(
            json.dumps(
                {
                    **data,
                    "type": "trade",
                    "data": strength,
                    "punishmentCount": P_PUNISHMENT_COUNT,
                    "stopLossCount": P_STOP_LOSS_COUNT,
                    "nextTimestampAllowedToTrade": P_NEXT_TIMESTAMP_ALLOWED_TO_TRADE,
                }
            )
        )


async def monitor_trading_log(file_path):
    if not os.path.exists(file_path):
        async with aiofiles.open(file_path, "w") as f:
            await f.write("")

    last_size = os.path.getsize(file_path)

    while True:
        current_size = os.path.getsize(file_path)

        if current_size > last_size:
            async with aiofiles.open(file_path, "r") as f:
                await f.seek(last_size)
                new_lines = await f.readlines()
                if new_lines:
                    last_line = new_lines[-1].strip()
                    data = json.loads(last_line)
                    if data.get("type") == "position" and isinstance(
                        data.get("data"), (int, float)
                    ):
                        print(f"持仓数据：{data}")
                        await handle_position_data(data)
            last_size = current_size
        await asyncio.sleep(1)


async def gui_websocket_server():
    async def handle_gui_connection(websocket):
        global current_websocket
        current_websocket = websocket
        global P_SETTINGS
        try:
            while True:
                message = await websocket.recv()
                data = json.loads(message)
                if data.get("type") == "get_settings":
                    print(f"当前惩罚设置: {P_SETTINGS}")
                    await websocket.send(
                        json.dumps(
                            {
                                "type": "settings",
                                "data": P_SETTINGS,
                            }
                        )
                    )
                if data.get("type") == "set_settings":
                    print(f"更新惩罚设置: {data.get('data')}")
                    set_settings(data.get("data"))
                    P_SETTINGS.update(data.get("data"))

        except websockets.exceptions.ConnectionClosed:
            print("网页 WebSocket 服务已断开")

    server = await websockets.serve(handle_gui_connection, "0.0.0.0", 5679)
    print("网页 WebSocket 服务已启动： ws://0.0.0.0:5679")
    await server.wait_closed()


async def main():
    async with DGLabWSServer("0.0.0.0", 5678, 60) as server:
        global client
        client = server.new_local_client()

        # Monitor trading log file
        asyncio.create_task(monitor_trading_log(CONFIG["LOG_FILE_PATH"]))

        # Start GUI WebSocket server
        asyncio.create_task(gui_websocket_server())

        # Print QR code for app connection
        url = client.get_qrcode(CONFIG["WS_URL"])
        print("请扫描二维码连接到 DG-LAB App")
        gen_qrcode(url)

        # Wait for binding
        await client.bind()
        print(f"成功绑定客户端 {client.target_id}")

        async for data in client.data_generator():

            # Handle strength data updates
            if isinstance(data, StrengthData):
                print(f"App 强度信息: {data}")

            # Handle disconnection or heartbeat
            elif data == RetCode.CLIENT_DISCONNECTED:
                print("App 断连，请重启软件")
                client.add_pulses()
                await client.rebind()
                print("重新绑定成功")

            else:
                print(f"不支持的信息: {data}")


if __name__ == "__main__":
    asyncio.run(main())
