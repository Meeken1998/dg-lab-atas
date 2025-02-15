import socketserver
import http.server
import os
import asyncio


async def start_gui_web_server():
    with socketserver.TCPServer(("", 5680), http.server.SimpleHTTPRequestHandler) as httpd:
        os.chdir('gui')
        print("网页插件地址： http://127.0.0.1:5680")
        await httpd.serve_forever()

if __name__ == "__main__":
    asyncio.run(start_gui_web_server())
