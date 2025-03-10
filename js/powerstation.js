class PowerStation {
  constructor(batteryCapacity, maximumInput, maximumOutput) {
    this.batteryCapacity = batteryCapacity;
    this.maximumInput = maximumInput;
    this.maximumOutput = maximumOutput;
    this.capacityLeft = batteryCapacity;
    this.inputs = 0;
    this.outputs = {};
  }

  updateInput(voltage, current) {
    const power = voltage * current;
    if (power > this.maximumInput) {
      this.inputs = power;
      return;
    }
    this.inputs = power;
    this.capacityLeft = Math.min(
      this.capacityLeft + power,
      this.batteryCapacity,
    );
  }

  connectOutput(outputId) {
    this.outputs[outputId] = 0;
  }

  updateOutput(outputId, voltage, current) {
    if (this.outputs[outputId] !== undefined) {
      this.outputs[outputId] = voltage * current;
    }
  }

  disconnectOutput(outputId) {
    delete this.outputs[outputId];
  }

  updateBatteryLevel(capacityLeft) {
    this.capacityLeft = capacityLeft;
  }

  get batteryPercentage() {
    return parseFloat(
      ((this.capacityLeft / this.batteryCapacity) * 100).toFixed(1),
    );
  }

  get totalOutputPower() {
    return Object.values(this.outputs).reduce((sum, power) => sum + power, 0);
  }

  get timeRemaining() {
    const netPower = this.inputs - this.totalOutputPower;
    if (netPower === 0) return '99:59';
    const hours = Math.floor(this.capacityLeft / Math.abs(netPower));
    const minutes = Math.round(
      ((this.capacityLeft % Math.abs(netPower)) / Math.abs(netPower)) * 60,
    );
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}`;
  }

  get status() {
    const outputPower = this.totalOutputPower; // Use the totalOutputPower getter
    const netPower = this.inputs - outputPower; // Difference between input and output power

    if (this.inputs > this.maximumInput || outputPower > this.maximumOutput) {
      return 'overload'; // Overload has the highest priority
    }
    if (outputPower > 0 && this.inputs === 0) {
      return 'discharging'; // Active discharging without input power
    }
    if (netPower > 0) {
      return 'charging'; // If input is greater than output, it's charging
    }
    return 'idle'; // If no input and output
  }
}

// Создаем электростанцию с батареей 2000 Вт·ч, макс. входом 500 Вт и макс. выходом 800 Вт
const station = new PowerStation(3000, 500, 800);

// Проверяем начальный уровень заряда
console.log('🔋 Начальный заряд:', station.batteryPercentage, '%');

// Заряжаем электростанцию (например, 220 В * 2 А = 440 Вт)
station.updateInput(220, 2);
console.log('⚡ Зарядка... Новый заряд:', station.batteryPercentage, '%');

// Подключаем устройство
station.connectOutput('phone');
station.updateOutput('phone', 30, 2); // 20 В * 3 А = 60 Вт
console.log(
  '🔌 Подключен телефон. Текущая выходная мощность:',
  station.totalOutputPower,
  'Вт',
);

// Проверяем статус и оставшееся время
console.log('📊 Статус электростанции:', station.status);
console.log('⏳ Время работы:', station.timeRemaining);

// Отключаем устройство
station.disconnectOutput('phone');
console.log(
  '❌ Телефон отключен. Общая выходная мощность:',
  station.totalOutputPower,
  'Вт',
);

// Проверяем финальный статус
console.log('📊 Финальный статус электростанции:', station.status);
