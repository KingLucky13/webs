import mysql.connector
from mysql.connector import Error
#Развожу, чтобы не мешалось.
def create_connection(host_name, user_name, user_password, db_name): 
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password,
            database=db_name
        )
        print("Connection to MySQL DB successful")
    except Error as e:
        print(f"The error '{e}' occurred")

    return connection

connection = create_connection("localhost", "root", "Lucky13012004", "logpas") #Теперь подключение к нужной шеме DB.
def execute_query(connection, query): #Запросы, точнее, их обвязка.
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        connection.commit()
        print("Query executed succesfully")
    except Error as e:
        print(f"The error '{e}' occurred")
def execute_read_query(connection, query): #Дэф для чтения с таблицы (В ТЕСТОВОМ РЕЖИМЕ. ПОКА НИЧЕГО НЕ АВТОМАТИЗИРОВАНО)
    cursor = connection.cursor() #В ТОМ ЧИСЛЕ ВСЁ ТО, ЧТО НИЖЕ. ЭКСПЕРИМЕНТИРУЮ.
    result = None
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return result
    except Error as e:
        print(f"The error '{e}' occurred")
def logIn(login, passw):
    lg1 = "'" + login + "'"
    ps1 = "" + passw +""
    connection = create_connection("localhost", "root", "Lucky13012004", "logpas")
    pr = "select exists(select login from lgpas where login = " + lg1 + ")"
    prpar = "select password from lgpas where login = " + lg1
    if str(execute_read_query(connection, pr)[0]) == "(1,)" and execute_read_query(connection, prpar)== [(ps1,)]:
        return 1
    else: return -1
def regUser(login, passw):
    lg1 = "'" + login + "'"
    connection = create_connection("localhost", "root", "Lucky13012004", "logpas") #Теперь подключение к нужной таблице DB.
    pr = "SELECT EXISTS(SELECT login FROM lgpas " +  "where login = " + lg1 +")" #КОМАНДА ПРОВЕРКИ 1 - есть, 0 - нет

    if str(execute_read_query(connection, pr)[0]) == "(0,)": #ПРОВЕРКА НА НАЛИЧИЕ ID В ТАБЛИЦЕ
        sql = "INSERT INTO lgpas (login, password) VALUES ( %s, %s )" # Тут ничего менять не нужно.
        val = [(login, passw)] #Ввод в таблицу. Ничего менять не нужно.
        cursor = connection.cursor()
        cursor.executemany(sql, val)
        connection.commit() # Хрень для активации ввода в таблицу.
        return True
    else: return False
def addRas(typ, cat, name, summa, login):
    typ="'" + typ + "'"
    cat="'" + cat + "'"
    name="'" + name + "'"
    summa="'" + summa + "'"
    login="'" + login + "'" 
    connection = create_connection("localhost", "root", "Lucky13012004", "logpas")
    ins_user_info = "insert into expenses (type, category, date, name, summa, login)\
    values (" + typ +"," + cat + "," + "now()," + name + "," + summa + "," + login + ")"
    print(ins_user_info)
    execute_query(connection, ins_user_info)
def getRas(log):
    select_users = "SELECT login FROM " + "logpas" + " where login = " + log #ПУТЬ НА ID
    select_user_info = "SELECT expenses.type, expenses.category, expenses.date, expenses.name,\
    expenses.summa FROM expenses WHERE expenses.login =" + log
    users_info = execute_read_query(connection, select_user_info)
    return users_info
