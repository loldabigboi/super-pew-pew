class StatsManager {

    static getHighscore() {
        return localStorage.getItem('highscore') || 0;
    }

    static setHighscore(newHighscore) {
        const prevHighscore = localStorage.getItem('highscore');
        if (prevHighscore == undefined || prevHighscore < newHighscore) {
            localStorage.setItem('highscore', newHighscore);
            return true;  // was a highscore
        }
        return false  // not a highscore
    }

    static addEnemyKill() {
        const curr = localStorage.getItem('kills') || 0;
        localStorage.setItem('kills', curr+1);
    }
    
    static getEnemiesKilled() {
        return localStorage.getItem('kills') || 0;
    }

    static addDeath() {
        const curr = localStorage.getItem('deaths') || 0;
        localStorage.setItem('deaths', curr+1);
    }

    static getDeaths() {
        return localStorage.getItem('deaths') || 0;
    }

    static addCratePickup() {
        const curr = localStorage.getItem('crates') || 0;
        localStorage.setItem('crates', curr+1);
    }

    static getCratesPickedUp() {
        return localStorage.getItem('crates') || 0;
    }

    static addShotFired() {
        const curr = localStorage.getItem('shots') || 0;
        localStorage.setItem('shots', curr+1);
    }

    static getShotsFired() {
        return localStorage.getItem('shots') || 0;
    }

}