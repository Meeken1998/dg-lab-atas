import sys
import os
import asyncio
from PyQt5.QtCore import QUrl, QTimer, pyqtSignal, QObject
from PyQt5.QtWidgets import QApplication, QMainWindow
from PyQt5.QtWebEngineWidgets import QWebEngineView, QWebEngineSettings, QWebEnginePage
from qasync import QEventLoop  # 使用 qasync 来适配 asyncio 和 PyQt5
import threading
import http.server
import socketserver

os.chdir('dist/gui')


class Worker(QObject):
    # 定义一个信号，表示服务器启动完成
    server_started = pyqtSignal()

    def start_gui_web_server(self):
        with socketserver.TCPServer(("0.0.0.0", 5680), http.server.SimpleHTTPRequestHandler) as httpd:
            print("网页插件地址：http://127.0.0.1:5680")
            self.server_started.emit()  # 发出信号
            httpd.serve_forever()

    def run_server_in_thread(self):
        # 在单独的线程中运行服务器
        threading.Thread(target=self.start_gui_web_server, daemon=True).start()


class MainWindow(QMainWindow):
    def on_js_console_message(self, level, message, line, source_id):
        """
        捕获 JavaScript 控制台消息并打印
        """
        print(
            f"JavaScript Console Message: {message} (Line: {line}, Source: {source_id})")
        if level == QWebEnginePage.ErrorMessage:
            print(
                f"JavaScript Error: {message} (Line: {line}, Source: {source_id})")

    def __init__(self):
        super().__init__()

        # 设置窗口大小为 300x300
        self.setFixedSize(300, 300)

        # 创建 WebEngineView 来显示网页
        self.webview = QWebEngineView(self)

        # 设置 WebEngineView 为窗口的中央部件
        self.setCentralWidget(self.webview)

        # 窗口标题
        self.setWindowTitle("DG-LAB ATAS")
        self.webview.settings().setAttribute(QWebEngineSettings.JavascriptEnabled, True)
        self.webview.settings().setAttribute(QWebEngineSettings.WebGLEnabled, True)
        self.webview.settings().setAttribute(QWebEngineSettings.LocalStorageEnabled, True)
        self.webview.settings().setAttribute(QWebEngineSettings.ErrorPageEnabled, True)
        self.webview.settings().setAttribute(
            QWebEngineSettings.LocalContentCanAccessRemoteUrls, True)
        self.webview.settings().setAttribute(
            QWebEngineSettings.LocalContentCanAccessFileUrls, True)
        self.webview.page().javaScriptConsoleMessage = self.on_js_console_message

        # 启动一个定时器，在后台运行 asyncio 的事件循环
        self.timer = QTimer(self)
        self.timer.start(100)  # 每100ms检查一次异步任务


if __name__ == "__main__":
    sys.argv.append("--disable-web-security")
    # app = QApplication(sys.argv)
    app = QApplication(['', '--no-sandbox', '--disable-web-security'])

    # 使用 qasync 来支持 asyncio 事件循环
    loop = QEventLoop(app)
    asyncio.set_event_loop(loop)

    # 创建 Worker 实例，并将信号连接到更新 WebView 的方法
    worker = Worker()

    worker.server_started.connect(
        lambda: window.webview.setUrl(QUrl("https://meeken1998.github.io/dg-lab-atas/index.html")))

    # 启动 Web 服务器
    worker.run_server_in_thread()

    # 启动 Web 窗口
    window = MainWindow()
    window.show()
    window.webview.page().profile().clearHttpCache()

    # 运行事件循环
    loop.run_forever()

    sys.exit(app.exec_())
