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

print(CONFIG)


def print_qrcode(data: str):
    # Generate and print the QR code in ASCII format
    qr = qrcode.QRCode()
    qr.add_data(data)
    f = io.StringIO()
    qr.print_ascii(out=f)
    f.seek(0)
    print(f.read())


async def handle_position_data(data):
    if not client:
        return
    volume, pnl, security = data.get("volume"), data.get("data"), data.get("security")

    # Apply strength based on PNL
    strength = abs(volume) * 0 if pnl >= 0 else abs(pnl)

    # Increase strength if security is NQ
    if "NQ" in security:
        strength *= 2

    strength = round(strength * 0.5)
    print(f"⚡ Strength: {strength}")

    # Send pulses to the client
    await client.add_pulses(Channel.A, *(PULSE_DATA["信号灯"] * 5))
    await client.set_strength(Channel.A, StrengthOperationType.SET_TO, strength)


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
                        print(data)
                        await handle_position_data(data)
            last_size = current_size
        await asyncio.sleep(1)
        
async def gui_websocket_server():
    async def handle_gui_connection(websocket, path):
        print(f"GUI client connected: {websocket.remote_address}")
        try:
            while True:
                message = await websocket.recv()
                print(f"Received from GUI: {message}")
                # Handle incoming messages from the GUI
                response = "Message received from GUI"
                await websocket.send(response)
        except websockets.exceptions.ConnectionClosed:
            print("GUI client disconnected")

    server = await websockets.serve(handle_gui_connection, "0.0.0.0", 8769)
    print("GUI WebSocket server started on ws://0.0.0.0:5679")
    await server.wait_closed()


async def main():
    async with DGLabWSServer("0.0.0.0", 5678, 60) as server:
        global client
        client = server.new_local_client()

        # Print QR code for app connection
        url = client.get_qrcode(CONFIG["WS_URL"])
        print("Please scan the QR code with DG-Lab App to connect")
        print_qrcode(url)

        # Monitor trading log file
        asyncio.create_task(monitor_trading_log(CONFIG["LOG_FILE_PATH"]))
        
        # start gui websocket server
          # Start GUI WebSocket server
        asyncio.create_task(gui_websocket_server())

        # Wait for binding
        await client.bind()
        print(f"Successfully bound to App {client.target_id}")

        async for data in client.data_generator():

            # Handle strength data updates
            if isinstance(data, StrengthData):
                print(f"Received strength data update from App: {data}")
                last_strength = data

            # Handle disconnection or heartbeat
            elif data == RetCode.CLIENT_DISCONNECTED:
                print(
                    "App disconnected. You can try scanning the QR code to reconnect."
                )
                client.add_pulses()
                await client.rebind()
                print("Successfully re-bound")

            else:
                print(f"Received unhandled data: {data}")


if __name__ == "__main__":
    asyncio.run(main())
