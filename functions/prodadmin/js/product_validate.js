function validate_name(name) {
  if (!name || name.length < 2)
    return 'Error: min 2 chars'
  else
    return null
}

/////  video:

function validate_condition(condition) {
  var cond = condition.toLowerCase().replace(/ +/g, "")
  if ((cond.includes("new") && cond.length == 3) 
      || (cond.includes("open") && cond.includes("box") && cond.trim().length == 7) 
      || cond.includes("used") && cond.length == 4)
    return null
  else
    return 'Error: Please Type \'New\', \'Open Box\', or \'Used\''
}

function validate_summary(summary) {
  if (!summary || summary.length < 5)
    return 'Error: min 5 chars'
  else
    return null
}

// need to convert string into number: parseFloat
function validate_price(price) {
  if (!parseFloat(price))
    return `Error: Invalid price value ${price}`
  else
    return null
}

function validate_quantity(quantity) {
  if (!parseFloat(quantity))
    return `Error: Invalid quantity value ${quantity}`
  else
    return null
}