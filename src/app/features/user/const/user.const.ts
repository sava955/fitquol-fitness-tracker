import { Gender, UnitMeasurment, UserGoal } from "../enums/user.enum";


export const gender: Gender.MALE | Gender.FEMALE = Gender.MALE;

export const goal: UserGoal.LOSE_WEIGHT | UserGoal.REMAIN_WEIGHT | UserGoal.GAIN_WEIGHT = UserGoal.LOSE_WEIGHT;

export const measurementSystem: UnitMeasurment.METRIC | UnitMeasurment.IMPERIAL = UnitMeasurment.METRIC;