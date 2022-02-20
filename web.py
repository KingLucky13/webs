from flask import Flask,request,render_template,url_for,redirect
from BD import logIn,regUser,addRas,getRas
app=Flask(__name__)
userLogin=""
data=list()
balance=0
def getBalance(data):
    balance=0
    for i in data:
        if(i[0]=="doxod"):
            balance+=int(i[4])
        else:
            balance-=int(i[4])
    return balance
@app.route("/",methods=["GET","POST"])
def index():
    if "login" in request.form:
        login=request.form["login"]
        password=request.form["password"]
        result=logIn(login,password)
        result=1
        if(result==1):
            userLogin=login
            data=getRas(userLogin)
            #print(data)
            balance=getBalance(data)
            return redirect(f"http://127.0.0.1:5000/user/<{login}>")
    elif "reg_login" in request.form:
        reg_login=request.form["reg_login"]
        reg_password=request.form["reg_password"]
        result=regUser(reg_login,reg_password)
        print(reg_login,reg_password,result)
    return render_template("index.html")
@app.route('/user/<login>/')
def user(login):
   data=getRas(login[1:len(login)-1]
    return render_template("user.html",login=login[1:len(login)-1],usData=data,balance=balance)
if __name__=="__main__":
    app.run()
