//  Black magic don't touch
pins.setPull(DigitalPin.P20, PinPullMode.PullUp)
//  Utility
//  Turn left 90 degrees
function turn_left() {
    let counter = 0
    while (true) {
        basic.showNumber(counter)
        sensors.DDMmotor(gb1_direction, 1, gb1_speed, turn_speed + turn_speed_offset1)
        sensors.DDMmotor(gb2_direction, 1, gb2_speed, turn_speed + turn_speed_offset2)
        if (counter >= 2 && pins.digitalReadPin(ir1) == 0) {
            sensors.DDMmotor(gb1_direction, 1, gb1_speed, 0)
            sensors.DDMmotor(gb2_direction, 1, gb2_speed, 0)
            break
        }
        
        if (counter == 0 && pins.digitalReadPin(ir1) == 0) {
            counter = 1
        }
        
        if (counter == 1 && pins.digitalReadPin(ir1) == 1) {
            counter = 2
        }
        
    }
}

//  Turn right 90 degrees
function turn_right() {
    let counter = 0
    while (true) {
        basic.showNumber(counter)
        sensors.DDMmotor(gb1_direction, 0, gb1_speed, turn_speed + turn_speed_offset1)
        sensors.DDMmotor(gb2_direction, 0, gb2_speed, turn_speed + turn_speed_offset2)
        if (counter >= 2 && pins.digitalReadPin(ir2) == 0) {
            sensors.DDMmotor(gb1_direction, 1, gb1_speed, 0)
            sensors.DDMmotor(gb2_direction, 1, gb2_speed, 0)
            break
        }
        
        if (counter == 0 && pins.digitalReadPin(ir2) == 0) {
            counter = 1
        }
        
        if (counter == 1 && pins.digitalReadPin(ir2) == 1) {
            counter = 2
        }
        
    }
}

//  Adjust angle so that the car is straight
function adjust_left() {
    while (pins.digitalReadPin(ir1) == 1 && pins.digitalReadPin(ir2) == 0) {
        sensors.DDMmotor(gb1_direction, 1, gb1_speed, turn_speed + turn_speed_offset1)
        sensors.DDMmotor(gb2_direction, 1, gb2_speed, turn_speed + turn_speed_offset2)
    }
    sensors.DDMmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.DDMmotor(gb2_direction, 0, gb2_speed, 0)
}

function adjust_right() {
    while (pins.digitalReadPin(ir1) == 0 && pins.digitalReadPin(ir2) == 1) {
        sensors.DDMmotor(gb1_direction, 0, gb1_speed, turn_speed + turn_speed_offset1)
        sensors.DDMmotor(gb2_direction, 0, gb2_speed, turn_speed + turn_speed_offset2)
    }
    sensors.DDMmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.DDMmotor(gb2_direction, 0, gb2_speed, 0)
}

function forward(time: number) {
    sensors.DDMmotor(gb1_direction, 0, gb1_speed, speed + speed_offset1)
    sensors.DDMmotor(gb2_direction, 1, gb2_speed, speed + speed_offset2)
    basic.pause(time)
    //  Car is angled too far to the right
    if (pins.digitalReadPin(ir1) == 1 && pins.digitalReadPin(ir2) == 0) {
        stop()
        adjust_left()
    }
    
    //  Car is angled too far to the left
    if (pins.digitalReadPin(ir1) == 0 && pins.digitalReadPin(ir2) == 1) {
        stop()
        adjust_right()
    }
    
}

function back(time: number) {
    sensors.DDMmotor(gb1_direction, 1, gb1_speed, speed + speed_offset1)
    sensors.DDMmotor(gb2_direction, 0, gb2_speed, speed + speed_offset2)
    basic.pause(time)
    //  Car is angled too far to the right
    if (pins.digitalReadPin(ir1) == 1 && pins.digitalReadPin(ir2) == 0) {
        stop()
        adjust_left()
    }
    
    //  Car is angled too far to the left
    if (pins.digitalReadPin(ir1) == 0 && pins.digitalReadPin(ir2) == 1) {
        stop()
        adjust_right()
    }
    
}

function stop() {
    sensors.DDMmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.DDMmotor(gb2_direction, 0, gb2_speed, 0)
}

//  For each intersection
function first() {
    forward(1200)
    stop()
    turn_left()
    basic.pause(2000)
    forward(2000)
    stop()
    back(3000)
    forward(1000)
    stop()
    turn_right()
}

function second() {
    forward(100)
    stop()
    turn_left()
    forward(2500)
    stop()
    back(2500)
    turn_right()
}

function third() {
    forward(100)
    stop()
    turn_left()
    forward(2000)
    stop()
    back(4000)
    forward(1000)
    stop()
    turn_right()
}

function fourth() {
    forward(100)
    stop()
    turn_left()
    back(1000)
    stop()
    forward(3500)
    stop()
}

//  Pins
let force = DigitalPin.P20
let ir1 = DigitalPin.P1
let ir2 = DigitalPin.P8
let gb1_speed = AnalogPin.P14
let gb1_direction = AnalogPin.P13
let gb2_speed = AnalogPin.P16
let gb2_direction = AnalogPin.P15
//  Speeds and offsets incase one side is faster then the other (they are)
let speed = 75
let speed_offset1 = 0
let speed_offset2 = 0
let turn_speed = 200
let turn_speed_offset1 = 0
let turn_speed_offset2 = 0
let active = false
//  Keep track of how many intersections the car has passed
let intersectionCount = 0
while (true) {
    if (pins.digitalReadPin(force) == 0 && !active) {
        active = true
    }
    
    if (active) {
        //  Move forward a little bit
        forward(100)
        //  If both sensors detect black then it is an intersection
        if (pins.digitalReadPin(ir1) == 1 && pins.digitalReadPin(ir2) == 1) {
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
