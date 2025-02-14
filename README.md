# ⚡ DG-LAB ATAS 风控插件


<div align="center">
  <img src="https://github.com/Meeken1998/atas-dg-lab-plugin/blob/master/dg-lab-atas.jpg" width="800" height="425" alt="sample">
</div>


## 简介

使用 🐺 DG-LAB 郊狼情趣电击来执行期货交易风控。

免责声明：任何使用本插件进行交易的行为均由使用者自行承担风险，作者不承担任何责任。

## 使用方法

### 1. 构建 ATAS 插件

使用 Visual Studio 等 IDE 打开 `atas-indicator\DgLabAtas.csproj` 构建 dll。

注意，可能需要修改以下文件：

1. `atas-indicator\DgLabAtas.csproj` 引用的 ATAS 的 dll，参见 [ATAS API 文档](https://docs.atas.net/)
2. `atas-indicator\Class1.cs` 中的 `LOG_FILE_PATH`

然后在 ATAS 中导入指标。

### 2. 启动 Server

修改 `server.py` 的全局变量，安装依赖后直接启动，看到控制台中出现二维码即启动成功。

### 3. 使用 DG-LAB App 连接 Server

郊狼可以在淘宝自行购买，并 [下载 App](https://www.dungeon-lab.com/app-download.php)。

选择“SOCKET 控制”功能，确保启动服务的设备与手机在同一局域网下，扫描二维码连接。

## 扩展惩罚方式

惩罚方法在 `server.py` 中定义，欢迎自行扩展，目前我使用的是：

1. 头寸收益为负时，A 通道放电，波形为“信号灯” （可以在 `pulses.py` 中使用更多波形）
2. 如果品种是 NQ 或者 MNQ，强度翻倍（NQ 都敢扛？罪加一等！）
3. 亏多少，电多少，亏得越多，电得越狠（可自行扩展映射）

```python
async def handle_position_data(data):
    if not client:
        return
    volume, pnl, security = data.get("volume"), data.get("data"), data.get("security")

    # Apply strength based on PNL
    strength = abs(volume) * 0 if pnl >= 0 else abs(pnl)

    # Increase strength if security is NQ
    if "NQ" in security:
        strength *= 2

    strength = round(strength)
    print(f"⚡ Strength: {strength}")

    # Send pulses to the client
    await client.add_pulses(Channel.A, *(PULSE_DATA["信号灯"] * 5))
    await client.set_strength(Channel.A, StrengthOperationType.SET_TO, strength)
```

## 注意事项

别把电极片或者配件用在奇怪的位置，以及...量力而行（乐）

Enjoy~

## 关于

作者：[猫有点大@bilibili](https://space.bilibili.com/39903717)

致谢：[PyDGLab-WS](https://github.com/Ljzd-PRO/PyDGLab-WS)
