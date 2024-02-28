import { ref } from 'vue';
import _ from 'lodash';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia'
import { useFormDataStore } from '../stores/forms'
export default function helper() {

const formDataStore = useFormDataStore()
const { getPicklist} = storeToRefs(formDataStore)

  function getPicklistFields(fields){
    return _.reduce(fields, function(r,v,i){
        if(v.field_type.name=='picklist'){
            r.push(v.listName)
        }
        return r
    },[])
  }

  function getLookupFields(fields){
    return _.reduce(fields, function(r,v,i){
        if(v.field_type.name=='lookupModel' && (_.get(v.rules,'ss_dropdown',false) || _.get(v.rules,'ms_dropdown',false) || _.get(v.rules,'ss_list_view',false) || _.get(v.rules,'checkbox',false) || _.get(v.rules,'checkbox_inline',false) || _.get(v.rules,'radiobutton',false) || _.get(v.rules,'radiobutton_inline',false))){
            r.push(v.uniqueName)
        }
        return r
    },[])
  }

  
  function formatLookupOptions(options,fields, field) {
    let group = false
    let category = "";
    // console.log(options)
    let newOptions = _.reduce(options.values, function(res,val,i){
        if(val.level){
            group = true
            let hide = false
            if(val.level==2 && _.get(options.values,i-1+'.level',0) == 1){
                category = options.values[i-1]['name']
            }else if(val.level==1){
                if(_.get(options.values,i+1+'.level',1) == 2){
                    hide = true
                }else{
                    category = ""
                }
            }
            if(!hide){
                let index = _.findIndex(res,{'label':category})
                if(index > -1){
                    res[index]['options'].push(_.merge(val,{'value':val.name,'poupDisplayValues':[val.name]}))
                }else{
                    res.push({'label':category,'options':[_.merge(val,{'value':val.name,'poupDisplayValues':[val.name]})]})
                }
                
            }
        }else{
            let theField = field
            if(_.isNil(field))
                theField = _.find(fields,{'uniqueName': options.field})

            if(theField){
                let tmp = transformLookupValue(val,theField)
                res.push(tmp)
            }
        }
        return res
    },[])
    return {'group':group,'options':newOptions}
  }

  function transformLookupValue(option,field){
    let fieldGlue = _.get(field,'fieldGlue',' ')
    let displayFieldName = _.get(field, 'relation.displayFieldName',[])
    let data = option
    if(!_.isArray(option)){
        data = [option]
    }
    let result  = _.reduce(data, function(res,val,index){
        let poupDisplayValues = [];
        let popupFields = (_.has(field,'relation.popupDisplayFieldName')) ? field.relation.popupDisplayFieldName : field.relation.displayFieldName
        _.forEach(popupFields, function(f,i){
            if(f=='firstName' && popupFields[i+1]=='lastName'){
                poupDisplayValues.push(_.join(_.values(_.pick(val,['firstName','lastName'])), " "))
            }else if((f=='lastName' && popupFields[i-1]!='firstName') || f!='lastName'){
                if(!_.isNil(val[f]) && !_.isEmpty(val[f])){
                    poupDisplayValues.push(val[f])
                }
            }
        })
        res.push(_.merge(val,{'value':_.join(_.values(_.pick(val,displayFieldName)), fieldGlue),'poupDisplayValues':poupDisplayValues}))
        return res
    },[])

    if(!_.isArray(option))
        return result[0]
    else    
        return result
  }

  function transformFormValues(fields,values,formPage){
    let formValues = {}
    if(_.isNil(formPage) || formPage=='create'){
        formValues = getDefaultValue(fields,false)
    }else if(formPage=='show'){
        formValues = getModuleValues(fields,values,true)
    }else if(formPage=='edit'){
        formValues = getModuleValues(fields,values,false)
    }
    return formValues
  }

  function getDefaultValue(fields,displayValue){
    return _.reduce(fields, function(res,val,i){
        if(val.field_type.name=='percentage') {
            let tmp =  (_.get(val,'rules.default_value',false)) ? val.rules.default_value * 100 : 0;
            res[val.name] = (displayValue) ? tmp+"%" : tmp
        }else if(val.field_type.name=='number' || val.field_type.name=='currency'){
            res[val.name] =  (_.get(val,'rules.default_value',false)) ? transformNumberCurrency(val.rules.default_value,val.rules,displayValue) : 0;
        }else if(val.field_type.name=='boolean'){
            res[val.name] = _.get(val,'rules.default_value',false)
        }else if(val.field_type.name=='date' || val.field_type.name=='date_time'){
            res[val.name] =  (_.get(val,'rules.default_value',false)) ? transformDate(val.rules.default_value,val.rules,displayValue) : null;
        }else if(val.field_type.name=='picklist'){
            res[val.name] = (_.get(val,'rules.default_value',false)) ? transformPicklistValue(val.rules,val.listName) : null
        }else{
            res[val.name] = null
        }
        return res
    },{})
  }

  function getModuleValues(fields,values,displayValue){
    return _.reduce(fields, function(res,val,i){
        if(!_.isNil(values[val.name]) && !_.isEmpty(values[val.name])){
            if(val.field_type.name=='date' || val.field_type.name=='date_time'){
                res[val.name] =  transformDate(values[val.name],val.rules,displayValue)
            }else if(val.field_type.name=='picklist'){
                res[val.name] = (displayValue) ? values[val.name] : transformPicklistValue(val.rules,val.listName,values[val.name])
            }else{
                res[val.name] = values[val.name]
            }
        }else if(val.field_type.name=='percentage' || val.field_type.name=='number' || val.field_type.name=='currency' || val.field_type.name=='formula' || val.field_type.name=='rollUpSummary'){
            if(_.isNumber(values[val.name])){
                if(val.field_type.name=='percentage') {
                    let tmp =  values[val.name] * 100
                    res[val.name] = (displayValue) ? tmp+"%" : tmp
                }else{
                    res[val.name] =  transformNumberCurrency(values[val.name],val.rules,displayValue)
                }
              }else if(_.isString(values[val.name])){
                if(val.field_type.name=='percentage') {
                    let tmp =  _.toNumber(values[val.name]) * 100
                    res[val.name] = (displayValue) ? tmp+"%" : tmp
                }else{
                    res[val.name] =  transformNumberCurrency(_.toNumber(values[val.name]),val.rules,displayValue)
                }
              }else{
                res[val.name] = 0
              }
        }else{
            res[val.name] = null
        }
        return res
    },{})
  }

  function transformNumberCurrency(value,rules,displayValue){
    let result = value
    if(displayValue){
        if(_.has(rules,'decimal')){
            result = _.round(value,rules.decimal)
            let tempNumber = _.split(result, '.',2)
            if(tempNumber.length > 1){
                if(tempNumber[1].length < rules.decimal){
                    tempNumber[1] = _.pad(tempNumber[1],rules.decimal,'0')
                }
            }else{
                tempNumber.push(_.pad('',rules.decimal,'0'));
            }
            if(rules.decimal>0){
                if(_.get(rules,'comma_separated',false)){
                    result = _.toInteger(tempNumber[0]).toLocaleString() + '.' + tempNumber[1]
                }else{
                    result = _.toInteger(tempNumber[0]) + '.' + tempNumber[1]
                }
                
            }else{
                if(_.get(rules,'comma_separated',false)){
                    result = _.toInteger(tempNumber[0]).toLocaleString()
                }else{
                    result = _.toInteger(tempNumber[0])
                }
            }
        }else if(_.get(rules,'comma_separated',false)){
            result = _.toInteger(value).toLocaleString()
        }
        
        
    }else{
        if(_.has(rules,'decimal')){
            result = _.round(value,rules.decimal)
        } 
    }
    return result
  }

  function transformDate(value,rules,displayValue){
    let result = value
    
    if(displayValue){
        //for displaying in pages
        if(_.has(rules,'date_selection')){
            if(rules.date_selection=='month'){
                result = dayjs(_.trim(value)).format('YYYY MMM')
            }else if(rules.date_selection=='week'){
                result =  dayjs(_.trim(value)).format('YYYY [Week] ww')
            }
        }else{
            let format = (_.get(rules,'date_only',false)) ? "MM/DD/YYYY" : "MM/DD/YYYY HH:mm:ss"
            if(_.has(rules,'date_format')){
                let dfor = [];
                let char = ""
                if(_.includes(rules.date_format,'-')){
                    dfor = _.split(rules.date_format,'-')
                    char = "-"
                }else if(_.includes(rules.date_format,'/')){
                    dfor = _.split(rules.date_format,'/')
                    char = "/"
                }else{
                    char = ","
                }
                format = ""
                if(char==","){
                    var year = _.split(rules.date_format,',');
                    dfor = _.split(year[0],' ')
                    _.forEach(dfor,function(d){
                        d = _.trim(d)
                        if(d=='M'){
                            format = format + 'MMM'
                        }else if(d=='F'){
                            format = format + 'MMMM'
                        }else if(d=='d'){
                            format = format + 'DD'
                        }else if(d=='j'){
                            format = format +  'D'
                        }
                        format = format + " ";
                    })
                    if(_.trim(year[1])=='Y'){
                        format = _.trim(format) + ', YYYY'
                    }else if(_.trim(year[1])=='y'){
                        format = _.trim(format) + ', YY'
                    }
                }else{
                    _.forEach(dfor,function(d){
                        if(d=='m'){
                          format = format + 'MM'
                        }else if(d=='M'){
                          format = format + 'MMM'
                        }else if(d=='n'){
                          format = format + 'M'
                        }else if(d=='F'){
                          format = format + 'MMMM'
                        }else if(d=='d'){
                          format = format + 'DD'
                        }else if(d=='j'){
                          format = format +  'D'
                        }else if(d=='Y'){
                          format = format + 'YYYY'
                        }else if(d=='y'){
                          format = format + 'YY'
                        }
                        format = format + char;
                    })
                    format = _.trimEnd(format,char);
                }
            }
            result =  dayjs(_.trim(value)).format(format)
        }
    }else{
        //for form values
        if(_.has(rules,'default_value')){
            if(rules.default_value.type=='computed'){
                result = Date()
            }else{
                result = _.trim(rules.default_value.value)
            }
        }
        if(_.get(rules,'date_only',false)){
            result = dayjs(_.trim(result)).format("YYYY-MM-DD")
           
        }else{
            result = dayjs(_.trim(result)).format("YYYY-MM-DD HH:mm:ss")
        }            
    }
    return result
  }

  function checkFieldIfMultipleSelect(rules){
    if(_.get(rules,'ms_dropdown',false) || _.get(rules,'checkbox',false) || _.get(rules,'checkbox_inline',false) || _.get(rules,'ms_list_view',false)){
        return true
    }
    return false
  }

  function transformPicklistValue(rules,listName,value){
    let picklist = _.get(getPicklist.value,listName+".values",[])
    if(picklist){
        let multiple = checkFieldIfMultipleSelect(rules)
        if(!multiple){
            if(value){
                return _.find(picklist,{"value":value})
            }else{

            }
        }else{
            if(value){
                return _.filter(picklist,function(x){
                    if(_.includes(value,x.value)){
                        return true
                    }
                })
            }else{

            }
        }
    }else{
        return null
    }
  }

  

  return {
    getPicklistFields,
    getLookupFields,
    transformFormValues,
    formatLookupOptions,
    transformNumberCurrency,
    transformDate,
    checkFieldIfMultipleSelect,
    getModuleValues
  };
}