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

// Test cases
console.log('\n🔍 Тест: Проверка всех статусов PowerStation');

const station = new PowerStation(2000, 500, 800); // Батарея 2000 Вт·ч, макс. вход 500 Вт, макс. выход 800 Вт

// 1. Проверка IDLE (ничего не подключено)
console.log('✅ Ожидаемый статус: idle | Фактический статус:', station.status);

// 2. Проверка CHARGING (зарядка идёт)
station.updateInput(220, 2); // 220 В * 2 А = 440 Вт (заряжается)
console.log(
  '✅ Ожидаемый статус: charging | Фактический статус:',
  station.status,
);

// 3. Проверка DISCHARGING (энергия расходуется)
station.connectOutput('laptop');
station.updateOutput('laptop', 20, 3); // 20 В * 3 А = 60 Вт
station.updateInput(0, 0); // Ensure no input power
console.log(
  '✅ Ожидаемый статус: discharging | Фактический статус:',
  station.status,
);

// 4. Проверка OVERLOAD (превышена выходная мощность)
station.updateOutput('heater', 220, 5); // 220 В * 5 А = 1100 Вт (выше 800 Вт)
console.log(
  '✅ Ожидаемый статус: overload | Фактический статус:',
  station.status,
);

// 5. Отключаем всё и проверяем IDLE
station.disconnectOutput('laptop');
station.disconnectOutput('heater');
station.updateInput(0, 0);
console.log('✅ Ожидаемый статус: idle | Фактический статус:', station.status);
