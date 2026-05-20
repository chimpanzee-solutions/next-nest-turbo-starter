const template = (variables, { tpl }) => {
  const name = `${variables.componentName}Icon`.replace('Svg', '');

  return tpl`
${variables.imports};

${variables.interfaces};

export function ${name}(${variables.props}) {
  return ${variables.jsx};
}
`;
};

module.exports = template;
