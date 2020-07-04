class StatsManager {

    static getHighscore() {
        return parseInt(localStorage.getItem('highscore') || 0);
    }

    static setHighscore(newHighscore) {
        const prevHighscore = parseInt(localStorage.getItem('highscore'));
        if (isNaN(prevHighscore) || prevHighscore < newHighscore) {
            localStorage.setItem('highscore', newHighscore);
            return true;  // was a highscore
        }
        return false  // not a highscore
    }

    static addEnemyKill() {
        const curr = parseInt(localStorage.getItem('kills') || 0);
        localStorage.setItem('kills', curr+1);
    }
    
    static getEnemiesKilled() {
        return parseInt(localStorage.getItem('kills') || 0);
    }

    static addDeath() {
        const curr = parseInt(localStorage.getItem('deaths') || 0);
        localStorage.setItem('deaths', curr+1);
    }

    static getDeaths() {
        return parseInt(localStorage.getItem('deaths') || 0);
    }

    static addCratePickup() {
        const curr = parseInt(localStorage.getItem('crates') || 0);
        localStorage.setItem('crates', curr+1);
    }

    static getCratesPickedUp() {
        return parseInt(localStorage.getItem('crates') || 0);
    }

    static addShotFired() {
        const curr = parseInt(localStorage.getItem('shots') || 0);
        localStorage.setItem('shots', curr+1);
    }

    static getShotsFired() {
        return parseInt(localStorage.getItem('shots') || 0);
    }

    static addTimePlayed(time) {
        const curr = parseInt(localStorage.getItem('playtime') || 0);
        localStorage.setItem('playtime', curr+time)
    }

    static getTimePlayed() {
        return parseInt(localStorage.getItem('playtime') || 0);

    }

}