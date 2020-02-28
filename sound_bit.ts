/*******************************************************************************
 * Functions for edu:bit - Sound Bit.
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/

// Possible pins for Sound Bit.
enum SoundBitPin {
    //% block="P1*"
    P1 = AnalogPin.P1,
    P0 = AnalogPin.P0,
    P2 = AnalogPin.P2,
}

// Comparison type.
enum SoundSensorCompareType {
    //% block=">"
    MoreThan = 0,

    //% block="<"
    LessThan = 1
};



/**
 * Blocks for Sound Bit.
 */
//% weight=15 color=#ff8000 icon="\uf130" block="Sound Bit"
namespace edubit_sound_sensor {
    // Indicate whether background function has been created.
    let bgFunctionCreated = false;

    // Event type.
    let eventType = 0;

    // Array for compare type, threshold and pin number.
    let compareTypesArray: SoundSensorCompareType[] = [];
    let thresholdsArray: number[] = [];
    let pinsArray: SoundBitPin[] = [];

    // Array for old compare result.
    let oldCompareResult: boolean[] = [];



    /**
     * Return sound level (0-1023).
     * @param pin Pin number for sound sensor.
     */
    //% blockGap=8
    //% blockId=edubit_read_sound_sensor
    //% block="sound level %pin"
    export function readSoundSensor(pin: SoundBitPin = SoundBitPin.P1): number {
        return pins.analogReadPin(<number>pin);
    }


    /**
    * Compare the sound level (0-1023) with a number and return the result (true/false).
    * @param pin Pin number for sound sensor.
    * @param compareType More than or less than.
    * @param threshold The value to compare with.
    */
    //% blockGap=30
    //% blockId=edubit_compare_sound_sensor
    //% block="sound level %pin %compareType %threshold"
    //% threshold.min=0 threshold.max=1023
    export function compareSoundSensor(pin: SoundBitPin = SoundBitPin.P1, compareType: SoundSensorCompareType, threshold: number): boolean {
        let result = false;
        switch (compareType) {
            case SoundSensorCompareType.MoreThan:
                if (readSoundSensor(pin) > threshold) {
                    result = true;
                }
                break;

            case SoundSensorCompareType.LessThan:
                if (readSoundSensor(pin) < threshold) {
                    result = true;
                }
                break;
        }
        return result;
    }



    /**
    * Compare the sound level value with a number and do something when true.
    * @param pin Pin number for sound sensor.
    * @param compareType More than or less than.
    * @param threshold The value to compare with.
    * @param handler The code to run when true.
    */
    //% blockGap=8
    //% blockId=edubit_sound_sensor_event
    //% block="on sound level %pin %compareType %threshold"
    //% threshold.min=0 threshold.max=1023
    export function onEvent(pin: SoundBitPin, compareType: SoundSensorCompareType, threshold: number, handler: Action): void {
        // Use a new event type everytime a new event is create.
        eventType++;

        // Add the event info to the arrays.
        compareTypesArray.push(compareType);
        thresholdsArray.push(threshold);
        pinsArray.push(pin);

        // Create a placeholder for the old compare result.
        oldCompareResult.push(false);

        // Register the event.
        control.onEvent(getEventSource(pin), eventType, handler);

        // Create a function in background if haven't done so.
        // This function will check for pot value and raise the event if the condition is met.
        if (bgFunctionCreated == false) {
            control.inBackground(function () {

                while (true) {
                    // Loop for all the event created.
                    for (let i = 0; i < eventType; i++) {

                        // Check if the condition is met.
                        if (compareSoundSensor(pinsArray[i], compareTypesArray[i], thresholdsArray[i]) == true) {
                            // Raise the event if the compare result changed from false to true.
                            if (oldCompareResult[i] == false) {
                                control.raiseEvent(getEventSource(pinsArray[i]), i + 1);
                            }

                            // Save old compare result.
                            oldCompareResult[i] = true;
                        }
                        else {
                            // Save old compare result.
                            oldCompareResult[i] = false;
                        }
                        basic.pause(20)
                    }
                }

            });

            bgFunctionCreated = true;
        }

    }



    /**
    * Get the event source based on pin number.
    */
    function getEventSource(pin: SoundBitPin): EventBusSource {
        // Get the event source based on pin number.
        switch (pin) {
            case SoundBitPin.P0: return EventBusSource.MICROBIT_ID_IO_P0;
            case SoundBitPin.P1: return EventBusSource.MICROBIT_ID_IO_P1;
            case SoundBitPin.P2: return EventBusSource.MICROBIT_ID_IO_P2;
        }
        return null;
    }

}
