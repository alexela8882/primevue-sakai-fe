import _ from 'lodash';
import helper from '@/mixins/Helper';
export default function formulaParser() {

    const { extractFieldinExpressionFormat,extractEntityinExpressionFormat } = helper();

    function parseExpression(formula, values, currenEntity, index){
        let vm = this
         var postfix = infixToPostfix(formula);
         var evaluatedPostfix = null
         var calcPostfix = null
         var response = {
             status:"500",
             value:false,
             message:""
         }
         if (postfix == false) {
            response.message = "Postfix is not valid. Some tokens is not recognized"
         }
         else {
           var expression = formula;// .replace(/[()]/g,'')
           if (typeof expression !== 'string') {
             if (expression instanceof String) {
               expression = expression.toString();
             } else {
               return null;
             }
           }
           var tokens = expression.match(/([a-z][a-z0-9]*(_[a-z0-9]+)*)/gi);
           console.log(tokens);
           var newValues = {}
           _.forEach(tokens, function(token){
             var entity = (extractEntityinExpressionFormat(token)) ? extractEntityinExpressionFormat(token) : currenEntity;
             var field = extractFieldinExpressionFormat(token);
             if(index>=0){
               //formula field is in Mutable
               if(_.has(values[index],field)){
                 newValues[token] = values[index][field]
               }
             }
             if(_.has(values[entity],field)){
               newValues[token] = values[field]
             }else if(_.has(values,field)){
               newValues[token] = values[field]
             }
           })
           console.log(newValues)
           var uniqTokens = _.uniq(tokens);
           var newVal = _.values(newValues);
           console.log(uniqTokens,newVal)
        //    if(newVal.length==uniqTokens.length){
             evaluatedPostfix = evaluatePostfix(postfix, newValues)
             response.status=200
             response.value = evaluatedPostfix
             response.message= "Success"
        //    }
         }
         return response
    }

    function doMath(operator, operand1, operand2){
        if(operator=="+"){
             return operand1+operand2;
        }else if(operator=="-"){
             return operand1-operand2;
        }else if(operator=="*"){
             return operand1*operand2;
        }else if(operator=="/"){
             return operand1/operand2;
        }
    }

    function evaluatePostfix(postfix, values){
        var tokens = postfix
        var result = []
        var operators = []
        var ctr=0;
        var operands = []
            console.log('tokens',tokens)
        tokens.forEach((token, index) => {
            console.log(token)
            if(token != ""){
                if(token.match(/([a-z][a-z0-9]*(_[a-z0-9]+)*)/g)) {
                    result.push(values[token])
                }else if(token.match(/(\d*\.)?\d+/g)) {
                    result.push(token)
                }else{
                ctr=0;
                while(ctr<2){
                    operands.push(result.pop())
                    ctr++;
                }
                result.push(doMath(token, operands[1], operands[0]))
                operands = []
                }
                console.log(result)
            }
        })
        return result
    }
    function precedence(token){
		if(token == '(' || token == ')'){
			 return 0;
		}

		if(token == '+' || token == '-'){
			 return 1;
		}

		if(token == '*' || token=='/'){
				return 2;
		}
		return -1;
	}

    function infixToPostfix(formula) {
        var expression = formula;// .replace(/[()]/g,'')
        if (typeof expression !== 'string') {
        if (expression instanceof String) {
            expression = expression.toString();
        } else {
            return null;
        }
        }

        var result = [];
        var stack = [];
        var tokens = expression.match(/([a-z][a-z0-9]*(_[a-z0-9]+)*)|([()+\-*/])|((\d*\.)?\d+)/gi);

        tokens.forEach(function(token){
            expression = expression.replace(token, "");
        });
        var BreakException = {};
        if (Array.isArray(tokens)) {
        tokens.forEach((token, tIndex) => {
            if(precedence(token) == -1) {
                result.push(token);
            }else{
                if(token=='('){
                stack.push(token);
                }else if(token==')'){
                var topToken = stack.pop();
                while (topToken != '('){
                    result.push(topToken)
                    topToken = stack.pop()
                }
                }else{
                while (!_.isEmpty(stack) && (precedence(stack[stack.length-1]) >= precedence(token))){
                    result.push(stack.pop())
                }
                stack.push(token)
                }
            }
        });
        }
        while(!_.isEmpty(stack)){
        result.push(stack.pop())
        }
    return (result.length >= 1 ? result : false);
    }

    return{
        parseExpression
    }
}