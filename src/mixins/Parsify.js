import _ from 'lodash';
import dayjs from 'dayjs';
export default function parsify() {

    function parseExpression(expression,entityName,values){
        let result = {'value':false,'message':''}
        let postfix = infixToPostfix(expression)
        if (_.isEmpty(postfix)) {
            result.message = "Postfix is not valid. Some tokens is not recognized"
        }else {
            let formValues = {}
            formValues[entityName] = values

            let evaluatedPostfix = evaluatePostfix(postfix, entityName, _.cloneDeep(formValues))
            if(evaluatedPostfix == false) {
                result.message = "Postfix is not valid. Some given field maybe empty"
            }else {
                let calcPostfix = calculatePostfix(evaluatedPostfix);
                result.value = calcPostfix
                result.message= "Success"
            }
         }
        return result
    }

    function infixToPostfix(expression){
        let result = [];
        let stack = [];
        let tokens = expression.match(/(-?(?:\d+\.?\d*|-?\.\d*))|("[a-zA-Z0-9/_()'\s]*")|[()+\-*/]|<=|>=|<|>|==|!=|&&|\|\||true|false|(empty*)|(contains*)|(\{[a-zA-Z0-9_\:\.\#]*\})|(\#[a-zA-Z_]*\#)/gi);
        tokens.forEach(function(token){
            expression = expression.replace(token, "");
        });
        let containsInvalidChars = /[^()+\-*/0-9.\s|\,|\=\=|<|>|\<\=|\>\=|\!\=|\&\&|\|\||true|false|(empty*)|(\{a-zA-Z0-9_*\:\.})|(\"a-zA-Z0-9_\s*'\")]/gi.test(expression);
        // console.log(expression.match(/[^()+\-*/0-9.\s|\,|\=\=|<|>|\<\=|\>\=|\!\=|\&\&|\|\||true|false|(empty*)|(\{a-zA-Z0-9_*\:\.})|(\"a-zA-Z0-9_\s*'\")]/gi))
        // console.log(expression,tokens,containsInvalidChars)
        if (_.isArray(tokens) && !containsInvalidChars) {
            tokens.forEach((token, tIndex) => {
                if(stack.length == 0) {
                   if(precedence(token) != -1){
                        stack[stack.length]= token;
                   }else{
                        result.push(token);
                   }
                }else{
                  // console.log(token);
                  if(precedence(token) > -1){
                    let isPush = false;
                    while(isPush != true){
                      // console.log(stack);
                      if(precedence(stack[stack.length-1]) >= precedence(token)) {
                        stack.push(token);
                        isPush = true;
                      } else {
                        let item = stack[stack.length-1];
                        if(stack[stack.length-1] != '(' && stack[stack.length-1] != ')') {
                            result.push(stack[stack.length-1]);
                        }
                        stack.pop();
                        isPush = false;
                        if(stack.length == 0) {
                            stack.push(token);
                            isPush = true;
                        }
                      }
                    }
                  }else{
                      result.push(token);
                  }
                }
      
            });
        }
        stack.reverse().forEach((sItem, sIndex) => {
            if(sItem != '(' && sItem != ')'){
              result.push(sItem);
            }
        });
        return result
    }

    function precedence(token){
		if(token == '(' || token == ')'){
			 return 0;
		}

		if(token == '*' || token == '/'){
			 return 1;
		}

		if(token == '+' || token == '-'){
				return 2;
		}
		if(token == '<=' || token == '>=' || token == '<' || token == '>' || token == '==' || token == '!=' || token =='contains'){
				return 3;
		}
		if(token == '&&'){
			return 4;
		}
		if(token == '||'){
			return 5;
		}
		return -1;
	}

    function evaluatePostfix(expression, mainEntity, requests){
        let tokens = expression
        let result = []
        tokens.forEach((token, index) => {
         if(token != ""){
            if(token.match(/[()+\-*/]|==|<|>|<=|>=|!=|&&|\|\||true|false|contains/g)) {
                result.push(token)
            }
 
            else if(token.match(/(\{[a-zA-Z0-9_\:\.\#]*\})/gi)) {
                let field = token.replace(/\{|\}/g,"")
                let therequests = null
                let index1 = null
                let index2 = null
                let tokenKey = null
                let isMutable = /(\:\:)/g.test(field) 
                if(isMutable) {
                   let mutafield = field.split('::')
                   index1 = mutafield[0]
                   index2 = mutafield[1]
                }else{
                  index1 = mainEntity
                  index2 = field
                }
                let hasObjectKeys = /\./g.test(index2)
                let hasItemKeys = /\#/g.test(index2)
                if( hasObjectKeys) {
                  let temp = index2.split('.');
                  if(_.isNull(requests[index1][temp[0]])){
                    therequests = null
                  }else if(_.isArray(requests[index1][temp[0]])){
                    therequests = requests[index1][temp[0]]
                  }else if(_.isObject(requests[index1][temp[0]])){
                    therequests = [requests[index1][temp[0]]]
                  }else{
                    therequests = [{value:requests[index1][temp[0]]}]
                  }
                  if(therequests != null){
                    therequests.push({objectKey:temp[1]})
                  }
               } else if(hasItemKeys) {
                 let temp = index2.split('#')
                 index2 = temp[0]
                 therequests = requests[index1][index2]
                 therequests['itemKey'] = temp[1]
               } else {
                   therequests = requests[index1][index2]
               }
                   if(therequests == true || therequests == false){
                     result.push(therequests)
                   }else{
                        result.push(therequests)
                   }
            }
            else if(token.match(/(^[\"]*[A-Za-z_ \s0-9']*[\"]*$)/gi)){
              let field = token;
               if((field == null) || (field == "")){
                  result.push("empty")
               } else {
                  result.push(field.replace(/"/g, ''))
               }
            }
 
            else if(token.match(/(-?(?:\d+\.?\d*|-?\.\d*))/gi)){
                result.push(token)
            }
         }
        })
        return result
    }

    function calculatePostfix(expression) {
      if(expression == null){
          return null
      }
      let result
      let tokens = expression
      let stack = []
      let first
      let second
      for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i]
  
        if (token === '*') {
          second = stack.pop()
          first = stack.pop()
  
          if (typeof first === 'undefined') {
            first = 1
          }
  
          if (typeof second === 'undefined') {
            second = 1
          }
          stack.push(Number(first) * Number(second))
        } else if (token === '/') {
          second = stack.pop()
          first = stack.pop()
          stack.push(Number(first) / Number(second))
        } else if (token === '+') {
          second = stack.pop()
          first = stack.pop()
          stack.push(Number(first) + Number(second))
        } else if (token === '-') {
          second = stack.pop()
          first = stack.pop()
          stack.push(Number(first) - Number(second))
        }else if(token == '=='){
          second = stack.pop()
          first = stack.pop()
          if (typeof first === 'undefined' || typeof second === 'undefined') {
            stack.push(Number(token))
          } else {
            if(!hasArray(first, second)){
              if(!hasObject(first, second)){
                if(!hasDate(first, second)){
                  let sec = (_.isBoolean(first) && second=='true') ? true : ((_.isBoolean(first) && second=='false') ? false : second)
                  stack.push(first == sec)
                } else {
                  stack.push(evaluateDate(first, second, token))
                }
              }else{
                  stack.push(evaluateObject(first, second, token))
              }
            } else {
  
               stack.push(evaluateArray(first, second, token))
            }
  
          }
        }else if(token == '<'){
          second = stack.pop()
          first = stack.pop()
          if (typeof first === 'undefined' || typeof second === 'undefined') {
            stack.push(Number(token))
          }else{
            if(hasInteger(first, second)){
              stack.push(first < second)
            }else{
              stack.push(evaluateDate(first, second, token))
            }
          }
        }else if(token == '>'){
          second = stack.pop()
          first = stack.pop()
          if (typeof first === 'undefined' || typeof second === 'undefined') {
            stack.push(Number(token))
          }else{
            if(hasInteger(first, second)){
              stack.push(first > second)
            }else{
              stack.push(evaluateDate(first, second, token))
            }
          }
        }else if(token == '<='){
          second = stack.pop()
          first = stack.pop()
          if (typeof first === 'undefined' || typeof second === 'undefined') {
            stack.push(Number(token))
          }else{
            if(hasInteger(first, second)){
              stack.push(Number(first) <= Number(second))
            }else{
              stack.push(evaluateDate(first, second, token))
            }
          }
        }else if(token == '>='){
          second = stack.pop()
          first = stack.pop()
          if (typeof first === 'undefined' || typeof second === 'undefined') {
            stack.push(Number(token))
          }else{
            if(hasInteger(first, second)){
              stack.push(Number(first) >= Number(second))
            }else{
              stack.push(evaluateDate(first, second, token))
            }
          }
        }else if(token == '!='){
          second = stack.pop()
          first = stack.pop()
          if (typeof first === 'undefined' || typeof second === 'undefined') {
            stack.push(Number(token))
          }else{
            if(!hasArray(first, second)){
              if(!hasObject(first, second)){
                if(!hasDate(first, second)){
                  stack.push(first != second)
                } else {
                  stack.push(evaluateDate(first, second, token))
                }
              }else{
                  stack.push(evaluateObject(first, second, token))
              }
            } else {
               stack.push(evaluateArray(first, second, token))
            }
          }
        }else if(token == '&&') {
          second = stack.pop()
          first = stack.pop()
          if (typeof first === 'undefined' || typeof second === 'undefined') {
            stack.push(Number(token))
          }else{
              stack.push(first && second)
          }
        }else if(token == '||'){
          second = stack.pop()
          first = stack.pop()
          if (typeof first === 'undefined' || typeof second === 'undefined') {
            stack.push(Number(token))
          }else{
              stack.push(first || second)
          }
        }else if(token == 'contains'){
          second = stack.pop()
          first = stack.pop()
          if (typeof first === 'undefined' || typeof second === 'undefined') {
            stack.push(Number(token))
          }else{
            if(!_.isEmpty(first) && !_.isNull(first)){
              stack.push(_.includes(first,second))
            }else{
              stack.push(false)
            }
          }
        } else {
          stack.push(token)
        }
      }
  
      result = stack.pop()
      return result
    }

    function hasInteger(first, second) {
      if(_.isInteger(Number(first)) && _.isInteger(Number(second))){
        return true
      }else{
        return false
      }
    }

    function hasObject(first, second){
      if(_.isObject(first) || _.isObject(second)){
          return true
      } else {
          return false
      }
    }

    function evaluateObject(thefirst, thesecond, operator){
        let first, second
        let diff = null
        if(_.isObject(first) || _.isObject(second)){
            first = thefirst[thefirst.itemKey]
            second = thesecond[thesecond.itemKey]
        }else if(_.isObject(first) && typeof second == 'string') {
            first = thefirst[thefirst.itemKey]
            second = thesecond[thesecond.itemKey].replace(/"/g, '')
        }else if(typeof first == 'string' && _.isObject()){
            first = thefirst[thefirst.itemKey].replace(/"/g, '')
            second = thesecond[thesecond.itemKey].replace(/"/g, '')
        }
  
        if(operator == '=='){
            return first == second
        }else if(operator == '!='){
            return first != second
        }else{
            return Number(operator)
        }
    }

    function hasArray(first, second) {
        if(first instanceof Array || second instanceof Array){
            return true
        }else{
            return false
        }
    }

    function evaluateArray(first, second, operator){
      let diff = []
        if(first instanceof Array && second instanceof Array){
          let objectKey1 = first[first.length - 1].objectKey
          let objectKey2 = second[second.length - 1].objectKey
            diff = _.difference(first, second)
        } else if(first instanceof Array && typeof second == 'string') {
            let objectKey = first[first.length - 1].objectKey
            diff  = _.filter(first, [objectKey, second.replace(/"/g, '')])
        }else if(typeof first == 'string' && second instanceof Array){
            let objectKey = second[second.length - 1].objectKey
            diff  = _.filter(second, [objectKey, first.replace(/"/g, '')])
        }
  
        if(diff.length != 0 && operator == '=='){
              return true
        }else if(diff.length != 0 && operator == '!='){
              return false
        }else if(diff.length == 0 && operator == '!='){
              return true
        }else if(diff.length == 0 && operator == '=='){
              return false
        }else{
              return Number(operator)
        }
    }
  
    function hasDate(first, second){
        if(dayjs(first).isValid() || dayjs(second).isValid()){
            return true
        }else{
            return false
        }
    }
  
    function evaluateDate(first, second, token){
          if(token == "<"){
            if(dayjs(first).isBefore(dayjs(second))){
              return true
            } else {
              return false
            }
          } else if (token == ">") {
            if(dayjs(first).isAfter(dayjs(second))){
              return true
            }else{
              return false
            }
          } else if(token == "<="){
            if(dayjs(first).isSameOrBefore(dayjs(second))){
              return true
            }else{
              return false
            }
          } else if(token == ">="){
            if(dayjs(first).isSameOrAfter(dayjs(second))){
              return true
            }else{
              return false
            }
          } else if(token == "=="){
            if(dayjs(first).isSame(dayjs(second))){
              return true
            }else{
              return false
            }
          } else if(token == "!="){
            if(!dayjs(first).isSame(dayjs(second))){
              return true
            } else{
              return false
            }
          }else{
             return Number(token)
          }
    }

    function tokenize(expression) {
      var tokens = infixToPostfix(expression)
      return pullAllFields(tokens)
    }
    function pullAllFields(tokens) {
      var fields = []
      if(!_.isEmpty(tokens)){
        tokens.forEach((token, index) => {
          if(token.match(/(\{[a-zA-Z0-9_\:\.]*\})/gi)) {
            fields.push(token)
          }
              
       })
      }
 
         return fields
    }

    function pullAllFieldsInExpression(expression) {
       return expression.match(/(\{[a-zA-Z0-9_\:\.]*\})/gi)
    }

    return{
        parseExpression,
        tokenize,
        pullAllFieldsInExpression
    }
}