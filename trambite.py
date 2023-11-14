import serial
import os

arduino = serial.Serial('COM3', 9600, timeout=5)

last_status = ""

try:
    while True:
        data = arduino.readline().decode().strip()
        print(f"Recebido: {data}")

        if "ABRIR_COBERTURA" in data:
            last_status = "Status do Telhado: 1"
        elif "FECHAR_COBERTURA" in data:
            last_status = "Status do Telhado: 0"

        with open('dadosArduino.txt', 'w') as file:
            file.write(last_status)
except KeyboardInterrupt:
    print("Programa interrompido pelo usuário.")
finally:
    arduino.close()
