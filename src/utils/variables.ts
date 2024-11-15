export const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true' || process.env.VUE_APP_DEV_MODE === 'true';

export const serviceUrl = "https://db4.onchaincoin.io/verification-service";
export const serviceUrlSliced = "db4.onchaincoin.io/verification-service";
export const disabledFeatures = {
  leagueRanks: true,
  squadRanks: true,
  squadsTop: true,
  example: true,
  rockets: false,
  boss: false,
  gems: false,
  autoClicker: false,
}

export const boostChances = {
  rocket: 1000,
  boss: 1000,
  gem: 2000,
}
