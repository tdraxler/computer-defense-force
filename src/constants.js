export const CONST = {
  SCENES: {
    START:      'START',
    MENU:       'MENU',
    TUTORIAL:   'TUTORIAL',
    TUTORIAL2:   'TUTORIAL2',
    TUTORIAL3:   'TUTORIAL3',
    LEVEL:      'LEVEL',
    BUILD_MENU: 'BUILD-MENU',
    ENEMY:      'ENEMY',
    DEATH:      'DEATH',
    VIC:        'VIC',
    SHOP:       'SHOP',
    BULLET:     'BULLET'
  },
  T_SIZE: 16,
  RECHARGE_DELAY: 10
};

export const MAP_CONSTANTS = {
  T_SIZE: 16,
  BUILD_AREA_INDEX: 146
}

export const CURRENT_ACTION = {
  BUILD:    'BUILD',
  DEMOLISH: 'DEMOLISH',
  NONE:     'NONE'
};

export const LIMITS = {
  LEVELS: 3
};

export const FONT_CONFIG_SMALL = {
  fontFamily: ['press_start'],
  fontSize: 8, 
  color: '#ffffff',
  shadow: {
    color: '#444444',
    fill: true,
    offsetX: 1,
    offsetY: 1
  }
}

export const FONT_CONFIG_MOUSEOVER = {
  fontFamily: ['m5x7'],
  fontSize: 16, 
  color: '#ffffff',
  shadow: {
    color: '#333333',
    fill: true,
    offsetX: 1,
    offsetY: 1
  }
}

export const FONT_CONFIG_ALERT = {
  fontFamily: ['m5x7'],
  fontSize: 16, 
  color: '#ffffff',
  shadow: {
    color: '#aa1111',
    fill: true,
    offsetX: 1,
    offsetY: 1
  }
}