<i>“Turning 'I'm screwed' from a joke into reality.”</i>

<h1 align="center">
  ⚡ DG-LAB ATAS Risk Control Plugin
</h1>

<p align="center">
  <i>“Turning 'I'm screwed' from a joke into reality.”</i>
</div>

<p align="center">
  <a href="https://github.com/Meeken1998/dg-lab-atas/releases">
    Download Client
  </a>
  <span>&nbsp&nbsp</span>
  <a href="https://meeken1998.github.io/dg-lab-atas">
    Web Widget
  </a>
  <span>&nbsp&nbsp</span>
  <a href="/README_CN.md">
    中文文档
  </a>
</p>

---

> 💡 **Note:**  
> 🤗 The [Web Widget](https://meeken1998.github.io/dg-lab-atas) is now available!  
> **Attention:** The web widget must be used together with the software; otherwise, it won't connect to the shock device. For details, please see the [Usage Instructions](#usage-instructions).

---

## Real Feedback

> _"After setting it to 15, my hands started shaking on their own."_ — Alex, Founder of Deltapex
>
> _"Damn!"_ — Jiajun, Deltapex Batch 6
>
> _"For the sake of the show, I’m willing to give it 10 volts."_ — A GC Trader
>
> _"deep♂delta♂petas"_ — Hermite, Deltapex Batch 1
>
> _"Am I really going to the industrial park?"_ — A GC Trader

---

## Introduction

> ⚠️ **Disclaimer:**  
> Please carefully read and strictly follow the DG-LAB App safety guidelines. Do not use the accessories on critical areas such as the chest or head to avoid injury!
>
> This project is purely for entertainment and is intended for personal use only! Any trading behavior conducted with this plugin is solely at the user's own risk, and the author assumes no responsibility!

This project uses the DG-LAB 🐺 Coyote Erotic Shock Device to implement risk control in ATAS futures trading.

**DG-LAB** is a well-known Chinese BDSM toy manufacturer, and the project primarily uses their "Coyote 3.0 Shock Device" for risk control and punishment.

**ATAS** is a renowned order flow trading software that supports trading various futures contracts from international markets.

---

## Plugin Features

### 😡 Position Holding Risk Control

When there is a dynamic floating loss on an order, the device delivers a shock to ensure that the trader feels "pain" even if they don't feel "regret" when holding a position.

### 🔒 Consecutive Loss Risk Control

The device delivers a shock after consecutive stop losses and supports setting a mandatory rest period.

### ⚡ Flexible Shock Intensity

Allows setting a fixed value or dynamically calculating intensity based on floating loss.

### 🎥 Streamer Friendly

Provides a web widget that can be embedded in OBS to create an explosive streaming experience.

---

## Usage Instructions

1. Ensure you have a **Coyote 3.0 Erotic Shock Device** and have [downloaded the DG-LAB App](https://www.dungeon-lab.com/app-download.php).
2. [Download the latest client](https://github.com/Meeken1998/dg-lab-atas/releases) or build from source.
3. Place `DgLabAtasIndicator.dll` in the `ATAS\Indicators` directory, typically found in your "Documents" folder.
4. Right-click any chart → Indicators → Search for `DgLabIndicator` → Double-click to add.
5. Launch `DgLabAtas.exe` client; you should see a QR code if everything is working correctly.
6. Open the DG-LAB App on your phone, enter **SOCKET Control Mode**, and scan the code to connect.
7. (Optional) To use the web widget locally, start `WebPage.exe`. For streaming, it’s recommended to use the [🤗 Live Web Widget](https://meeken1998.github.io/dg-lab-atas/index.html).

---

## ❓ Troubleshooting

### QR Code Scanning Issues

#### 1. QR Code Garbled?

Try changing the console font: Right-click the title bar → Properties → Change the font.  
From version v0.0.4 onwards, you can also find the `qrcode.png` file in the program directory and open it to scan.

#### 2. App Can't Scan the Code?

Ensure that your phone and PC are on the same local network and that the App is using **SOCKET Control Mode** instead of **Remote Control Mode**.  
Sometimes using a mobile hotspot can cause issues—using a stable Wi-Fi network is recommended.

### DgLabAtasIndicator.dll Related Issues

#### 1. Where is the `ATAS\Indicators` Directory?

It’s located in the **Documents** folder, not in the ATAS installation directory.

#### 2. Can't Find the Indicator?

After placing the file, restart the ATAS software. You should be able to search for the indicator in the chart.  
If it still doesn’t appear, downgrade ATAS to a stable version.

#### 3. No Data After Loading the Indicator?

Check if ATAS is launched with **administrator privileges**.  
Since the program needs to write trading logs to `C:\trade.txt`, it requires admin rights.

---

## FAQs

### Will I Get Hurt?

If you follow the DG-LAB App’s safety instructions, you shouldn't get hurt.  
The Coyote device is designed as an adult toy, typically used on more sensitive areas, so using it on your arm or leg is completely safe.

Their products are certified (CE, FCC, RoHS), which is why it’s chosen as a punishment tool.  
The current intensity is adjustable—even at maximum (200), it won’t cause electric shock injuries.  
The official app provides numerous safety features, such as intensity limits and delay settings, which should be properly configured.

Nonetheless, always proceed cautiously and immediately stop using the device and client software if you feel uncomfortable.

---

### Why Do You Need This Plugin?

To achieve consistent profitability in futures trading, both **technical skills and mindset** are equally important. Even seasoned traders have blown up their accounts.

Order flow trading requires strong consistency, but the fast pace, short holding periods, and high volatility make it easy to lose that consistency, especially for less disciplined traders like me.

Floating losses are often caused by bad habits such as holding losing positions, averaging down, or canceling stop-loss orders. The discomfort of floating losses often leads to regret, and I wished for something to prevent reckless actions—thus, this plugin was born.

---

### How Can I Use This Open-Source Project?

You are free to use it under the MIT License.  
Since the development time was short, there might be bugs—feel free to test and contribute!

---

## About

**Author:** [CatIsKindOfBig@Bilibili](https://space.bilibili.com/39903717)  
**Special Thanks:** [PyDGLab-WS](https://github.com/Ljzd-PRO/PyDGLab-WS)
