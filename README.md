## 调研Excel自动生成器
### 将一定格式的txt文件转换为调研所需的excel文件
### 献给恪恪

### 使用步骤
- 下载[node.js](https://nodejs.org/zh-cn/)。
- 打开控制台 `win + r`，输入`cmd`，回车。
- 输入`node -v`，如果显示有内容，则`node`安装成功。
- 因为墙的原因，需要修改`npm`的镜像，继续在控制台输入`npm config set registry https://registry.npm.taobao.org/`
- 使用`dir`和`cd`命令进入到`ike`文件夹。
- `npm install`下载程序所有的依赖，仅需一次。
- 在`ke.txt`文件中粘贴调研的内容，可以同时粘贴多个小区，但是要符合文本规范。
- 在控制台内当前文件夹的路径下输入`node src/writeExcel.js`，即可生成当前日期的Excel文件。

```txt
12.13 马府新村
0.
1.乔木，硬质
2.硬质
野菊，酢浆草
3.硬质，灌木
天胡荽，酢浆草，碎米芥
4.硬质，灌木
酢浆草
5.硬质
酢浆草
6.建筑，灌木
酢浆草，萹蓄
7.建筑，灌木，地被
酢浆草
8.乔木
一年蓬，酢浆草，黄鹌菜
9.灌木
10.地被，硬质，灌木
```
