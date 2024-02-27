import { inject } from 'vue';
import _ from 'lodash';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia'

export default function validate() {

    const form = inject('form') 

    function validateField(keyName,field){
        let val = _.trim(form.value.values[keyName][field.name])
        form.value.errors[keyName][field.name] = []
        _.forEach(field.rules, function(ruleValue, ruleName){
            let msg = ''
            if(ruleName=='alpha'){
                if(!_.isEmpty(val) && !_.isNil(val)){
                    msg = alpha(val,field)
                }
            }else if(ruleName=='alpha_numeric'){
                if(!_.isEmpty(val) && !_.isNil(val)){
                    msg = alpha_numeric(val,field)
                }
            }else if(ruleName=='alpha_dash'){
                if(!_.isEmpty(val) && !_.isNil(val)){
                    msg = alpha_dash(val,field)
                }
            }else if(ruleName=='email'){
                if(!_.isEmpty(val) && !_.isNil(val)){
                    msg = email(val,field)
                }
            }else if(ruleName=='title_case'){
                if(!_.isEmpty(val) && !_.isNil(val)){
                    msg = title_case(val,field)
                }
            }else if(ruleName=='required'){
                msg = required(val,field)
            }else if(ruleName=='required_with'){
                if(_.isEmpty(val) || _.isNull(val)){
                    msg = required_with(val,field,keyName)
                }
            }else if(ruleName=='required_with_all'){
                if(_.isEmpty(val) || _.isNull(val)){
                    msg = required_with_all(val,field,keyName)
                }
            }else if(ruleName=='required_without'){
                if(_.isEmpty(val) || _.isNull(val)){
                    msg = required_without(val,field,keyName)
                }
            }else if(ruleName=='required_without_all'){
                if(_.isEmpty(val) || _.isNull(val)){
                    msg = required_without_all(val,field,keyName)
                }
            }else if(ruleName=='max'){
                msg = max(val,field,ruleValue)
            }
            if(msg){
                form.value.errors[keyName][field.name].push(msg)
            }
        })
    }


    //validation rules

    function alpha(value,field){
        var pattern = /^[a-zA-Z ]+$/i
        if(pattern.test(value) == false){
            return "The "+ field +" may only contain letters."
        }else{
            return ""
        }
    }

    function alpha_numeric(value,field){
        var pattern = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i
        if(pattern.test(value) == false){
            return "The "+ field +" may only contain letters and numbers."
        }else{
            return ""
        }
    }

    function alpha_dash(value,field){
        var pattern = /^[a-zA-Z\- ]+$/i
        if(pattern.test(value) == false){
            return "The "+ field +" may only contain letters, and dashes."
        }else{
            return ""
        }
    }

    function email(value,field){
        var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
        if(pattern.test(value) == false){
            return "The "+ field +" must be a valid email address."
        }else{
            return ""
        }
    }

    function title_case(value,field){
        var pattern = /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/
        if(pattern.test(value) == false){
            return "The "+ field +" should be in title case."
        }else{
            return ""
        }
    }

    function required(value,field){
       if(field.field_type.name!='file'){
            if((_.isEmpty(value) || _.isNull(value)) && (field.field_type.name!='number' && field.field_type.name!='currency')){
                return "The "+ field.label +" field is required."
            }else if(field.field_type.name=='number' && value==null){
                return "The "+ field.label +" field is required."
            }else{
              return "";
            }
       }
       return ""
    }

    function required_if(value,field,keyName){
        
        if(!_.isEmpty(givenFields)){
            return "The "+ field.label +" field is required when "+ _.join(givenFields,', ') + " " +pronoun+"  value."
        }else{
            return ""
        }
    }

    function required_with(value,field,keyName){
        let givenFields = [];
        if(_.isArray(field.rules['required_with'])){
            _.forEach(field.rules['required_with'], function(f){
                let anotherField = _.find(form.value.fields,{'name': f})
                let anotherFieldValue = _.get(form.value.values[keyName],anotherField.name,"")
                if(anotherField && !_.isEmpty(anotherFieldValue) && !_.isNull(anotherFieldValue)){
                    givenFields.push(anotherField.label)
                }
            })
        }else{
            let anotherField = _.find(form.value.fields,{'name': field.rules['required_with']})
            let anotherFieldValue = _.get(form.value.values[keyName],anotherField.name,"")
            if(anotherField && !_.isEmpty(anotherFieldValue) && !_.isNil(anotherFieldValue)){
                givenFields.push(anotherField.label)
            }
        }
        let pronoun = (givenFields.length == 1) ? "has" : "have"
        if(!_.isEmpty(givenFields)){
            return "The "+ field.label +" field is required when "+ _.join(givenFields,', ') + " " +pronoun+"  value."
        }else{
            return ""
        }
    }

    function required_with_all(value,field,keyName){
        let givenFields = [];
        _.forEach(field.rules['required_with_all'], function(f){
            let anotherField = _.find(form.value.fields,{'name': f})
            let anotherFieldValue = _.get(form.value.values[keyName],anotherField.name,"")
            if(anotherField && !_.isEmpty(anotherFieldValue) && !_.isNil(anotherFieldValue)){
                givenFields.push(anotherField.label)
            }
        })
        let pronoun = (givenFields.length == 1) ? "has" : "have"
        if(givenFields.length == field.rules['required_with_all'].length){
            return "The "+ field.label +" field is required when "+ _.join(givenFields,', ') + " " +pronoun+"  value."
        }else{
            return ""
        }
    }
    
    function required_without(value,field,keyName){
        let givenFields = [];
        _.forEach(field.rules['required_without'], function(f){
            let anotherField = _.find(form.value.fields,{'name': f})
            let anotherFieldValue = _.get(form.value.values[keyName],anotherField.name,"")
            if(anotherField && (_.isEmpty(anotherFieldValue) || _.isNil(anotherFieldValue))){
                givenFields.push(anotherField.label)
            }
        })
        let pronoun = (givenFields.length == 1) ? "is" : "are"
        if(!_.isEmpty(givenFields)){
            return "The "+ field.label +" field is required when "+ _.join(givenFields,', ') + " " +pronoun+"  empty."
        }else{
            return ""
        }
    }

    function required_without_all(value,field,keyName){
        let givenFields = [];
        _.forEach(field.rules['required_without_all'], function(f){
            let anotherField = _.find(form.value.fields,{'name': f})
            let anotherFieldValue = _.get(form.value.values[keyName],anotherField.name,"")
            if(anotherField && (_.isEmpty(anotherFieldValue) || _.isNil(anotherFieldValue))){
                givenFields.push(anotherField.label)
            }
        })
        let pronoun = (givenFields.length == 1) ? "is" : "are"
        if(givenFields.length == field.rules['required_without_all'].length){
            return "The "+ field.label +" field is required when "+ _.join(givenFields,', ') + " " +pronoun+"  empty."
        }else{
            return ""
        }
    }

    return {
        validateField
    };
}