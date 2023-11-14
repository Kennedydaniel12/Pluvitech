import serial
import os

arduino = serial.Serial('COM3', 9600, timeout=1)

last_status = ""

try:
    while True:
        data = arduino.readline().decode().strip()
        print(f"Recebido: {data}")

        if "Telhado Aberto: 1" in data and last_status != "Status do Telhado: 1":
            last_status = "Status do Telhado: 1"
        elif "Telhado Aberto: 0" in data and last_status != "Status do Telhado: 0":
            last_status = "Status do Telhado: 0"

        # Verifica se houve alteração no status antes de escrever no arquivo
        with open('dadosArduino.txt', 'r') as file:
            current_status = file.read().strip()

        if current_status != last_status:
            with open('dadosArduino.txt', 'w') as file:
                file.write(last_status)
                print(f"Arquivo atualizado: {last_status}")

except KeyboardInterrupt:
    print("Programa interrompido pelo usuário.")
finally:
    arduino.close()
