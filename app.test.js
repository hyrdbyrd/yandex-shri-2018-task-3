const input = require('./input.json');
const { manager } = require('./app');

describe('Scheduler', () => {
    it('should return a schedule, whose will meet the requirements', () => {
        const result = manager(input);

        const { devices, maxPower } = input;
        const devicesId = devices.map(e => e.id);

        for (let hour in result.schedule) {
            const POWER = result.schedule[hour].reduce((prev, cur) => {
                prev += devicesId.indexOf(cur) + 1 ? devices[devicesId.indexOf(cur)].power : 0;
            }, 0);

            if (POWER > maxPower) 
                throw new Error(`Ahtung on ${hour} hour, because summ power{${POWER}} > maxPower{${maxPower}}`);
        }
        
        const mdses = result.consumedEnergy.devices;
        devicesId.forEach(id => {
            if (!mdses.hasOwnProperty(id))
                throw new Error(`Ahtung! Not all devices was used! Id ${id} no found!`);
        })
    });
})
