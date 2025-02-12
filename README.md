# ⚡ DG-LAB ATAS 风控插件


<div align="center">
  <img src="https://github.com/Meeken1998/atas-dg-lab-plugin/blob/master/dg-lab-atas.jpg" width="800" height="425" alt="sample">
</div>


## 简介

使用 🐺 DG-LAB 郊狼情趣电击来执行期货交易风控。

由于是自用插件，代码写的比较随意，仅供提供一种期货风控思路，欢迎二次创作。

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

## 注意事项

别把电极片或者配件用在奇怪的位置，以及...量力而行（乐）

Enjoy~

## 关于作者

[猫有点大@bilibili](https://space.bilibili.com/39903717)
