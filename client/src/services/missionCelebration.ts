export const MISSION_REWARD_CONFIRMED_EVENT = 'novastars:mission-reward-confirmed';

export type MissionRewardConfirmedDetail = {
  localMissionId: string;
  contentMissionId: string;
  coinsAwarded: number;
  diamondsAwarded: number;
};

export const emitMissionRewardConfirmed = (
  detail: MissionRewardConfirmedDetail,
  target: EventTarget = window,
): void => {
  target.dispatchEvent(new CustomEvent<MissionRewardConfirmedDetail>(MISSION_REWARD_CONFIRMED_EVENT, { detail }));
};
