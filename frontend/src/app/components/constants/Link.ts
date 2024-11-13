const Aggregation = {
  dashed: false,
  svgPath: 'M 30 0 L 15 -10 L 0 0 L 15 10 z',
  fill: '#FFFFFF'
}

const Association = {
  dashed: false,
  svgPath: 'M 0 0 20 10 0 0 20 -10',
  fill: '#000000'
}

const Composition = {
  dashed: false,
  svgPath: 'M 30 0 L 15 -10 L 0 0 L 15 10 z',
  fill: '#000000'
}

const Dependency = {
  dashed: true,
  svgPath: 'M 0 0 20 10 0 0 20 -10',
  fill: '#000000'
}

const GeneralizationInheritance = {
  dashed: false,
  svgPath: 'M 20 -10 0 0 20 10 z',
  fill: '#FFFFFF'
}

const RealizationImplementation = {
  dashed: true,
  svgPath: 'M 20 -10 0 0 20 10 z',
  fill: '#FFFFFF'
}

export { Aggregation, Association, Composition, Dependency, GeneralizationInheritance, RealizationImplementation };
