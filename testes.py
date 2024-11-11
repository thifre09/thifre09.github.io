var1 = 1
ola = "ola"
def incrivel():
    global ola
    ola = "não ola"
    var1 = "batata"
    print(var1, ola)
incrivel()
print(var1, ola)