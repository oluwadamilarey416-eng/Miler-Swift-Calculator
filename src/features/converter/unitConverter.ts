import { UnitCategory } from '../../types';

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    units: [
      { id: 'mm', name: 'Millimeter', symbol: 'mm', ratioToBase: 0.001 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', ratioToBase: 0.01 },
      { id: 'm', name: 'Meter (Base)', symbol: 'm', ratioToBase: 1 },
      { id: 'km', name: 'Kilometer', symbol: 'km', ratioToBase: 1000 },
      { id: 'in', name: 'Inch', symbol: 'in', ratioToBase: 0.0254 },
      { id: 'ft', name: 'Foot', symbol: 'ft', ratioToBase: 0.3048 },
      { id: 'yd', name: 'Yard', symbol: 'yd', ratioToBase: 0.9144 },
      { id: 'mi', name: 'Mile', symbol: 'mi', ratioToBase: 1609.344 },
    ]
  },
  {
    id: 'mass',
    name: 'Mass & Weight',
    units: [
      { id: 'mg', name: 'Milligram', symbol: 'mg', ratioToBase: 0.000001 },
      { id: 'g', name: 'Gram', symbol: 'g', ratioToBase: 0.001 },
      { id: 'kg', name: 'Kilogram (Base)', symbol: 'kg', ratioToBase: 1 },
      { id: 't', name: 'Metric Ton', symbol: 't', ratioToBase: 1000 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', ratioToBase: 0.028349523125 },
      { id: 'lb', name: 'Pound', symbol: 'lb', ratioToBase: 0.45359237 },
    ]
  },
  {
    id: 'temperature',
    name: 'Temperature',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', ratioToBase: 1 },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', ratioToBase: 1 },
      { id: 'k', name: 'Kelvin', symbol: 'K', ratioToBase: 1 },
    ]
  },
  {
    id: 'area',
    name: 'Area',
    units: [
      { id: 'sq_m', name: 'Square Meter (Base)', symbol: 'm²', ratioToBase: 1 },
      { id: 'sq_km', name: 'Square Kilometer', symbol: 'km²', ratioToBase: 1000000 },
      { id: 'sq_ft', name: 'Square Foot', symbol: 'ft²', ratioToBase: 0.09290304 },
      { id: 'acre', name: 'Acre', symbol: 'ac', ratioToBase: 4046.8564224 },
      { id: 'hectare', name: 'Hectare', symbol: 'ha', ratioToBase: 10000 },
    ]
  },
  {
    id: 'volume',
    name: 'Volume',
    units: [
      { id: 'ml', name: 'Milliliter', symbol: 'mL', ratioToBase: 0.001 },
      { id: 'l', name: 'Liter (Base)', symbol: 'L', ratioToBase: 1 },
      { id: 'cu_m', name: 'Cubic Meter', symbol: 'm³', ratioToBase: 1000 },
      { id: 'gal', name: 'Gallon (US)', symbol: 'gal', ratioToBase: 3.785411784 },
      { id: 'fl_oz', name: 'Fluid Ounce (US)', symbol: 'fl oz', ratioToBase: 0.0295735295625 },
    ]
  },
  {
    id: 'time',
    name: 'Time',
    units: [
      { id: 'ms', name: 'Millisecond', symbol: 'ms', ratioToBase: 0.001 },
      { id: 's', name: 'Second (Base)', symbol: 's', ratioToBase: 1 },
      { id: 'min', name: 'Minute', symbol: 'min', ratioToBase: 60 },
      { id: 'hr', name: 'Hour', symbol: 'hr', ratioToBase: 3600 },
      { id: 'day', name: 'Day', symbol: 'day', ratioToBase: 86400 },
      { id: 'wk', name: 'Week', symbol: 'wk', ratioToBase: 604800 },
      { id: 'yr', name: 'Year', symbol: 'yr', ratioToBase: 31536000 },
    ]
  },
  {
    id: 'speed',
    name: 'Speed',
    units: [
      { id: 'mps', name: 'Meter/second (Base)', symbol: 'm/s', ratioToBase: 1 },
      { id: 'kmh', name: 'Kilometer/hour', symbol: 'km/h', ratioToBase: 0.2777777777777778 },
      { id: 'mph', name: 'Miles/hour', symbol: 'mph', ratioToBase: 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', ratioToBase: 0.5144444444444445 },
    ]
  },
  {
    id: 'storage',
    name: 'Digital Storage',
    units: [
      { id: 'b', name: 'Bit', symbol: 'b', ratioToBase: 1 },
      { id: 'B', name: 'Byte (Base)', symbol: 'B', ratioToBase: 8 },
      { id: 'KB', name: 'Kilobyte', symbol: 'KB', ratioToBase: 8000 },
      { id: 'MB', name: 'Megabyte', symbol: 'MB', ratioToBase: 8000000 },
      { id: 'GB', name: 'Gigabyte', symbol: 'GB', ratioToBase: 8000000000 },
      { id: 'TB', name: 'Terabyte', symbol: 'TB', ratioToBase: 8000000000000 },
    ]
  }
];

export function convertUnit(
  value: number,
  category: UnitCategory,
  fromUnitId: string,
  toUnitId: string
): { result: number; formula: string } {
  if (fromUnitId === toUnitId) {
    return { result: value, formula: 'Same unit selected' };
  }

  const fromUnit = category.units.find(u => u.id === fromUnitId);
  const toUnit = category.units.find(u => u.id === toUnitId);

  if (!fromUnit || !toUnit) {
    return { result: value, formula: '' };
  }

  // Handle Temperature special offsets
  if (category.id === 'temperature') {
    let celsiusVal = value;
    if (fromUnitId === 'f') {
      celsiusVal = (value - 32) * (5 / 9);
    } else if (fromUnitId === 'k') {
      celsiusVal = value - 273.15;
    }

    let finalVal = celsiusVal;
    if (toUnitId === 'f') {
      finalVal = celsiusVal * (9 / 5) + 32;
    } else if (toUnitId === 'k') {
      finalVal = celsiusVal + 273.15;
    }

    return {
      result: parseFloat(finalVal.toFixed(6)),
      formula: `${fromUnit.symbol} → ${toUnit.symbol}`
    };
  }

  // Standard ratio conversions
  const baseValue = value * fromUnit.ratioToBase;
  const targetValue = baseValue / toUnit.ratioToBase;

  return {
    result: parseFloat(targetValue.toFixed(8)),
    formula: `1 ${fromUnit.symbol} = ${parseFloat((fromUnit.ratioToBase / toUnit.ratioToBase).toFixed(8))} ${toUnit.symbol}`
  };
}
