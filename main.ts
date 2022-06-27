//  Utility
//  Turn left 90 degrees
function turn_left() {
    let counter = 0
    sensors.DDMmotor(gb1_direction, 0, gb1_speed, 100)
    sensors.DDMmotor(gb2_direction, 0, gb2_speed, 100)
    while (true) {
        if (counter >= 2 && ir1 == 1) {
            sensors.DDMmotor(gb1_direction, 0, gb1_speed, 0)
            sensors.DDMmotor(gb2_direction, 0, gb2_speed, 0)
            break
        }
        
        if (counter == 0 && ir1 == 0) {
            counter = 1
        } else if (counter == 1 && ir1 == 1) {
            counter = 2
        }
        
    }
}

//  Turn right 90 degrees
function turn_right() {
    let counter = 0
    sensors.DDMmotor(gb1_direction, 1, gb1_speed, 100)
    sensors.DDMmotor(gb2_direction, 1, gb2_speed, 100)
    while (true) {
        if (counter >= 2 && ir2 == 1) {
            sensors.DDMmotor(gb1_direction, 0, gb1_speed, 0)
            sensors.DDMmotor(gb2_direction, 0, gb2_speed, 0)
            break
        }
        
        if (counter == 0 && ir2 == 0) {
            counter = 1
        } else if (counter == 1 && ir2 == 1) {
            counter = 2
        }
        
    }
}

//  Adjust angle so that the car is straight
function adjust_left() {
    while (ir1 == 0 && ir2 == 1) {
        sensors.DDMmotor(gb1_direction, 0, gb1_speed, 100)
        sensors.DDMmotor(gb2_direction, 0, gb2_speed, 100)
    }
    sensors.DDMmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.DDMmotor(gb2_direction, 0, gb2_speed, 0)
}

function adjust_right() {
    while (ir1 == 1 && ir2 == 0) {
        sensors.DDMmotor(gb1_direction, 1, gb1_speed, 100)
        sensors.DDMmotor(gb2_direction, 1, gb2_speed, 100)
    }
    sensors.DDMmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.DDMmotor(gb2_direction, 0, gb2_speed, 0)
}

function forward(time: number) {
    sensors.DDMmotor(gb1_direction, 1, gb1_speed, 100)
    sensors.DDMmotor(gb2_direction, 0, gb2_speed, 100)
    basic.pause(time)
}

function back(time: number) {
    sensors.DDMmotor(gb1_direction, 0, gb1_speed, 100)
    sensors.DDMmotor(gb2_direction, 1, gb2_speed, 100)
    basic.pause(time)
}

function stop() {
    sensors.DDMmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.DDMmotor(gb2_direction, 0, gb2_speed, 0)
}

//  For each intersection
function first() {
    stop()
    turn_left()
    forward(4000)
    stop()
    back(6000)
    forward(2000)
    stop()
    turn_right()
}

function second() {
    stop()
    turn_left()
    forward(5000)
    stop()
    back(5000)
    turn_right()
}

function third() {
    stop()
    turn_left()
    forward(4000)
    stop()
    back(8000)
    forward(2000)
    stop()
    turn_right()
}

function fourth() {
    stop()
    turn_left()
    back(2000)
    stop()
    forward(7000)
    stop()
}

//  Pins
let force = DigitalPin.P0
let ir1 = DigitalPin.P1
let ir2 = DigitalPin.P2
let gb1_speed = AnalogPin.P13
let gb1_direction = AnalogPin.P14
let gb2_speed = AnalogPin.P15
let gb2_direction = AnalogPin.P16
let active = false
//  Keep track of how many intersections the car has passed
let intersectionCount = 0
while (true) {
    //  Active the car when the force sensor is pressed
    if (force == 0 && !active) {
        active = true
    }
    
    if (active) {
        //  Move forward a little bit
        forward(100)
        //  Car is angled too far to the right
        if (ir1 == 0 && ir2 == 1) {
            stop()
            adjust_left()
        }
        
        //  Car is angled too far to the left
        if (ir1 == 1 && ir2 == 0) {
            stop()
            adjust_right()
        }
        
        //  If both sensors detect black then it is an intersection
        if (ir1 == 0 && ir2 == 0) {
            intersectionCount += 1
            if (intersectionCount == 1) {
                first()
            } else if (intersectionCount == 2) {
                second()
            } else if (intersectionCount == 3) {
                second()
            } else if (intersectionCount == 4) {
                third()
            } else if (intersectionCount == 5) {
                //  Last intersection so we're done
                fourth()
                break
            }
            
        }
        
    }
    
}
