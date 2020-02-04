/**
 * Board initialization and helper function.
 */
namespace edubit {
    // Initialize the IO pins.
    pins.P0.digitalRead();
    pins.P1.digitalRead();
    pins.P2.digitalRead();

    pins.P8.digitalRead();
    pins.P12.digitalRead();
    pins.P13.digitalRead();
    pins.P14.digitalRead();
    pins.P15.digitalRead();
    pins.P16.digitalRead();

    // Brake the motors.
    edubit_motors.brakeMotor(edubit_motors.MotorNumber.Motor1);
    edubit_motors.brakeMotor(edubit_motors.MotorNumber.Motor2);

    // Disable the servos.
    edubit_motors.disableServo(edubit_motors.ServoNumber.Servo1);
    edubit_motors.disableServo(edubit_motors.ServoNumber.Servo2);
    edubit_motors.disableServo(edubit_motors.ServoNumber.Servo3);



    /**
     * Limit the range of a number.
     * @param value The number we want to limit.
     * @param min Minimum value of the number.
     * @param max Maximum value of the number.
     */
    //% blockHidden=true
    //% blockId=edubit_limit
    export function limit(value: number, min: number, max: number): number {
        if (value < min) {
            value = min;
        }
        else if (value > max) {
            value = max;
        }
        return value;
    }
}