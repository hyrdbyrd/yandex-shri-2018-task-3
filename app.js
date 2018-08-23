module.exports.manager = input => {
    // Доступные модификаторы
    const mode = {
        default () {
            return [].concat(this.day, this.night);
        },
        day: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        night: [21, 22, 23, 0, 1, 2, 3, 4, 5, 6]
    }

    // Возвращает список часов в промежутке from..to
    function createHourList(from, to) {
        const res = []
        if (from > to) {
            to += 24;
        }

        for (let hour = from; hour < to; hour++) {
            res.push(hour > 23 ? hour - 24 : hour);
        }

        return res;
    }

    const { devices } = input;

    // Сортировка по мощности
    // Это пргодиться для того, чтобы не проиходило таких моментов,
    // когда просто нет слотов для обычных 50 КВат в час
    devices.sort((a, b) => a.power - b.power);

    // Конечный объект
    const result = {
        schedule: null,
        consumedEnergy: {
            value: 0,
            devices: 0
        }
    };

    // Временная планировка создана ради того,
    // чтобы без лишнего обхода массива девайсов,
    // можно было сравнить напряженность энергии на нужный нам час
    const schedule = {};
    createHourList(0, 24).forEach(hour => schedule[hour] = {
        value: 0,
        array: []
    });

    // Создано исключительно для удобства написания кода
    const computedDevices = {};
    let computedValue = 0;

    // Распределяем на каждый час (от 0 до 23)
    // значение тарифа, в формате rates[hour] = rate.value
    const rates = new Array(24);
    input.rates.forEach(rate => 
        createHourList(rate.from, rate.to).forEach(hour => rates[hour] = rate.value)
    )

    // Добавляет в результат нужные девайсы (на конкретный час)
    function addDevice(device, hour, value) {
        schedule[hour].array.push(device.id.toString());
        schedule[hour].value += device.power;
        computedValue += value;
        if (!computedDevices[device.id]) 
            computedDevices[device.id] = 0;
        computedDevices[device.id] += ~~(value * 1000) / 1000;
    }

    // Обход всех девайсов
    devices.forEach(device => {
        // Получение сего промежутка для девайса
        const time = mode[device.mode] || mode.default();
        const { power, id} = device;

        let { duration } = device;

        // Массив, для запоминания тех часов, которые мы пропускаем
        const memorize = [];

        // Обход всего промежутка
        time.forEach(hour => {
            // Проверка - не превышает ли напряшение выше максимумв на этот час
            if (schedule[hour].value + power > input.maxPower) return;

            // Получение значения на конкретный час
            const value = (power / 1000) * rates[hour];
            // Запушим все значения (на каждый час)
            memorize.push({
                value,
                hour
            });
        });

        // Сортировка по стоимости
        memorize.sort((a, b) => a.value - b.value);

        for (let i = 0; i < memorize.length; i++) {
            if (duration <= 0) return;
            const { value, hour } = memorize[i];
            addDevice(device, hour, value);
            duration--;
        }
    });

    // Возвращаем планировку в нормальное состояние
    for (let key in schedule) {
        schedule[key] = schedule[key].array;
    }

    // Заполнение result
    result.schedule = schedule;
    result.consumedEnergy.value = computedValue;
    result.consumedEnergy.devices = computedDevices;
    return result
}