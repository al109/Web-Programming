# Web-Programming -
To run the website you have to install node.js.
Once you have node.js ready, you have to navigate to the the directory you downloaded the website into in your terminal.
Once you are in the right directory you should then type node app.js into the terminal
This will start the server. You should be able to access the server in your web browser now by typing in localhost:2000 in the URL bar.
If you want more that one device to be able to play on the server, you have to modify the serv.listen(2000,); line in app.js to be serv.listen(2000,'Put network IPv4 address here');
To access the sever through the IPv4 address then you have to type 'YourIPv4':2000 into the address bar of your browser.
