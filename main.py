pins.set_pull(DigitalPin.P20, PinPullMode.PULL_UP)

# Utility
# Turn left 90 degrees
def turn_left():
    counter = 0

    while True:
        basic.show_number(counter)
        sensors.dd_mmotor(gb1_direction, 1, gb1_speed, turn_speed)
        sensors.dd_mmotor(gb2_direction, 1, gb2_speed, turn_speed)

        if (counter >= 2 and pins.digital_read_pin(ir1) == 0):    
            sensors.dd_mmotor(gb1_direction, 1, gb1_speed, 0)
            sensors.dd_mmotor(gb2_direction, 1, gb2_speed, 0)
            break

        if (counter == 0 and pins.digital_read_pin(ir1) == 0):
            counter = 1

        if (counter == 1 and pins.digital_read_pin(ir1) == 1):
            counter = 2

# Turn right 90 degrees
def turn_right():
    counter = 0

    while True:
        basic.show_number(counter)
        sensors.dd_mmotor(gb1_direction, 0, gb1_speed, turn_speed)
        sensors.dd_mmotor(gb2_direction, 0, gb2_speed, turn_speed)

        if (counter >= 2 and pins.digital_read_pin(ir2) == 0):
            sensors.dd_mmotor(gb1_direction, 1, gb1_speed, 0)
            sensors.dd_mmotor(gb2_direction, 1, gb2_speed, 0)
            break

        if (counter == 0 and pins.digital_read_pin(ir2) == 0):
            counter = 1

        if (counter == 1 and pins.digital_read_pin(ir2) == 1):
            counter = 2

# Adjust angle so that the car is straight
def adjust_left():
    while (pins.digital_read_pin(ir1) == 1 and pins.digital_read_pin(ir2) == 0):
        sensors.dd_mmotor(gb1_direction, 1, gb1_speed, turn_speed)
        sensors.dd_mmotor(gb2_direction, 1, gb2_speed, turn_speed)

    sensors.dd_mmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.dd_mmotor(gb2_direction, 0, gb2_speed, 0)
    
def adjust_right():
    while (pins.digital_read_pin(ir1) == 0 and pins.digital_read_pin(ir2) == 1):
        sensors.dd_mmotor(gb1_direction, 0, gb1_speed, turn_speed)
        sensors.dd_mmotor(gb2_direction, 0, gb2_speed, turn_speed)

    sensors.dd_mmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.dd_mmotor(gb2_direction, 0, gb2_speed, 0)


def forward(time):
    sensors.dd_mmotor(gb1_direction, 0, gb1_speed, speed)
    sensors.dd_mmotor(gb2_direction, 1, gb2_speed, speed)
    basic.pause(time)

    # Car is angled too far to the right
    if (pins.digital_read_pin(ir1) == 1 and pins.digital_read_pin(ir2) == 0):
        stop()
        adjust_left()

    # Car is angled too far to the left
    if (pins.digital_read_pin(ir1) == 0 and pins.digital_read_pin(ir2) == 1):
        stop()
        adjust_right()

def back(time):
    sensors.dd_mmotor(gb1_direction, 1, gb1_speed, speed)
    sensors.dd_mmotor(gb2_direction, 0, gb2_speed, speed)
    basic.pause(time)

    # Car is angled too far to the right
    if (pins.digital_read_pin(ir1) == 1 and pins.digital_read_pin(ir2) == 0):
        stop()
        adjust_left()

    # Car is angled too far to the left
    if (pins.digital_read_pin(ir1) == 0 and pins.digital_read_pin(ir2) == 1):
        stop()
        adjust_right()

def stop():    
    sensors.dd_mmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.dd_mmotor(gb2_direction, 0, gb2_speed, 0)

# For each intersection
def first():
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

def second():
    forward(100)
    stop()
    turn_left()
    forward(2500)


    stop()
    back(2500)

    turn_right()

def third():
    forward(100)
    stop()
    turn_left()


    forward(2000)

    stop()
    back(4000)

    forward(1000)

    stop()

    turn_right()

def fourth():
    forward(100)
    stop()
    turn_left()
    back(1000)

    stop()
    forward(3500)

    stop()

# Pins
force = DigitalPin.P20

ir1 = DigitalPin.P1
ir2 = DigitalPin.P8

gb1_speed = AnalogPin.P14
gb1_direction = AnalogPin.P13

gb2_speed = AnalogPin.P16
gb2_direction = AnalogPin.P15

speed = 75
turn_speed = 200

active = False

# Keep track of how many intersections the car has passed
intersectionCount = 0

while True:

    if (pins.digital_read_pin(force) == 0 and not active):
        active = True

    if (active):
        # Move forward a little bit
        forward(100)

        # If both sensors detect black then it is an intersection
        if (pins.digital_read_pin(ir1) == 1 and pins.digital_read_pin(ir2) == 1):
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