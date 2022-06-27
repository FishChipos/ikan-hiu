# Utility
# Turn left 90 degrees
def turn_left():
    counter = 0

    sensors.dd_mmotor(gb1_direction, 0, gb1_speed, 100)
    sensors.dd_mmotor(gb2_direction, 0, gb2_speed, 100)

    while True:
        if (counter >= 2 and ir1 == 1):    
            sensors.dd_mmotor(gb1_direction, 0, gb1_speed, 0)
            sensors.dd_mmotor(gb2_direction, 0, gb2_speed, 0)
            break

        if (counter == 0 and ir1 == 0):
            counter = 1

        elif (counter == 1 and ir1 == 1):
            counter = 2

# Turn right 90 degrees
def turn_right():
    counter = 0

    sensors.dd_mmotor(gb1_direction, 1, gb1_speed, 100)
    sensors.dd_mmotor(gb2_direction, 1, gb2_speed, 100)

    while True:
        if (counter >= 2 and ir2 == 1):
            sensors.dd_mmotor(gb1_direction, 0, gb1_speed, 0)
            sensors.dd_mmotor(gb2_direction, 0, gb2_speed, 0)
            break

        if (counter == 0 and ir2 == 0):
            counter = 1

        elif (counter == 1 and ir2 == 1):
            counter = 2

# Adjust angle so that the car is straight
def adjust_left():
    while (ir1 == 0 and ir2 == 1):
        sensors.dd_mmotor(gb1_direction, 0, gb1_speed, 100)
        sensors.dd_mmotor(gb2_direction, 0, gb2_speed, 100)

    sensors.dd_mmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.dd_mmotor(gb2_direction, 0, gb2_speed, 0)
    
def adjust_right():
    while (ir1 == 1 and ir2 == 0):
        sensors.dd_mmotor(gb1_direction, 1, gb1_speed, 100)
        sensors.dd_mmotor(gb2_direction, 1, gb2_speed, 100)

    sensors.dd_mmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.dd_mmotor(gb2_direction, 0, gb2_speed, 0)


def forward(time):
    sensors.dd_mmotor(gb1_direction, 1, gb1_speed, 100)
    sensors.dd_mmotor(gb2_direction, 0, gb2_speed, 100)
    basic.pause(time)

def back(time):
    sensors.dd_mmotor(gb1_direction, 0, gb1_speed, 100)
    sensors.dd_mmotor(gb2_direction, 1, gb2_speed, 100)
    basic.pause(time)

def stop():    
    sensors.dd_mmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.dd_mmotor(gb2_direction, 0, gb2_speed, 0)

# For each intersection
def first():
    stop()
    turn_left()
    forward(4000)

    stop()
    back(6000)

    forward(2000)

    stop()

    turn_right()

def second():
    stop()
    turn_left()
    forward(5000)


    stop()
    back(5000)

    turn_right()

def third():
    stop()
    turn_left()
    forward(4000)

    stop()
    back(8000)

    forward(2000)

    stop()

    turn_right()

def fourth():
    stop()
    turn_left()
    back(2000)

    stop()
    forward(7000)

    stop()

# Pins
force = DigitalPin.P0

ir1 = DigitalPin.P1
ir2 = DigitalPin.P2

gb1_speed = AnalogPin.P13
gb1_direction = AnalogPin.P14

gb2_speed = AnalogPin.P15
gb2_direction = AnalogPin.P16

active = False

# Keep track of how many intersections the car has passed
intersectionCount = 0

while True:
    # Active the car when the force sensor is pressed
    if (force == 0 and not active):
        active = True

    if (active):
        # Move forward a little bit
        forward(100)

        # Car is angled too far to the right
        if (ir1 == 0 and ir2 == 1):
            stop()
            adjust_left()

        # Car is angled too far to the left
        if (ir1 == 1 and ir2 == 0):
            stop()
            adjust_right()

        # If both sensors detect black then it is an intersection
        if (ir1 == 0 and ir2 == 0):
            intersectionCount += 1

            if (intersectionCount == 1):
                first()

            elif (intersectionCount == 2):
                second()
        
            elif (intersectionCount == 3):
                second()

            elif (intersectionCount == 4):
                third()

            # Last intersection so we're done
            elif (intersectionCount == 5):
                fourth()
                break