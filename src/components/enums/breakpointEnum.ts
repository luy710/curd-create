export enum sizeEnum {
  XS = 'XS',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
  XXL = 'XXL',
}

export enum screenEnum {
  XS = 540,
  SM = 768,
  MD = 992,
  LG = 1200,
  XL = 1920,
  XXL = 2400,
}

const screenMap = new Map<sizeEnum, number>()

screenMap.set(sizeEnum.XS, screenEnum.XS)
screenMap.set(sizeEnum.SM, screenEnum.SM)
screenMap.set(sizeEnum.MD, screenEnum.MD)
screenMap.set(sizeEnum.LG, screenEnum.LG)
screenMap.set(sizeEnum.XL, screenEnum.XL)
screenMap.set(sizeEnum.XXL, screenEnum.XXL)

export { screenMap }
