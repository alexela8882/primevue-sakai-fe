import { ref } from 'vue';
import _ from 'lodash';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia'
import { useFormDataStore } from '../stores/forms'
import { useBaseStore } from '../stores/base'
import { useModuleStore } from '../stores/modules'
import parsify from '@/mixins/Parsify';
export default function helper() {

const formDataStore = useFormDataStore()
const baseStore = useBaseStore()
const moduleStore = useModuleStore()
const { parseExpression,tokenize,pullAllFieldsInExpression } = parsify()
const { getPicklist} = storeToRefs(formDataStore)
const { getAuthUser} = storeToRefs(baseStore)
const { getModules } = storeToRefs(moduleStore)

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
            r.push(v)
        }
        return r
    },[])
  }

  
  function formatLookupOptions(options,fields, field) {
    let group = false
    let category = "";
    let newOptions = _.reduce(options, function(res,val,i){
        if(val.level){
            group = true
            let hide = false
            if(val.level==2 && _.get(options,i-1+'.level',0) == 1){
                category = options[i-1]['name']
            }else if(val.level==1){
                if(_.get(options,i+1+'.level',1) == 2){
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

  function transformLookupValue(option,field,displayValue){
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
    if(displayValue){
        if(!_.isArray(option))
            return result[0]['value']
        else    
            return _.join(result,'value',', ')
    }else{
        if(!_.isArray(option))
            return result[0]
        else    
            return result
    }
    
  }

  function transformLookupDisplay(value,field){
    let fieldGlue = _.get(field,'fieldGlue',' ')
    let displayFieldName = _.get(field, 'relation.displayFieldName',[])
    let transformed = {'label':'','link':''}
    let module = _.find(getModules.value, {'mainEntity':field.relation.entity.name})
    let link = null;
    if(module){
        link = '/#/modules/page/' + module.name + '/' + module._id + '/detail-page/'
    }
    if(!_.isArray(value)){
        transformed['label'] = _.join(_.values(_.pick(value,displayFieldName)), fieldGlue)
        transformed['link'] = (link) ? link + value._id : null
    }else{
        _.forEach(value, function(val){
            let valueLink = (link) ? link + val._id : null
            transformed.push({'label': _.join(_.values(_.pick(val,displayFieldName)), fieldGlue),'link': valueLink})
        })
    }
    return transformed

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
        }else if(val.name=='owner_id'){
            res[val.name] = _.merge(getAuthUser.value,{'value':getAuthUser.value.name})
        }else if(val.name=='branch_id'){
            res[val.name] = _.merge(getAuthUser.value.branch,{'value':getAuthUser.value.branch.name})
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

  function transformForSaving(values,fields,isModalForm){
    let result = {}
    _.forEach(fields, function(val,i){
        if(_.has(values,val.name)){
            if(isModalForm || (!isModalForm && val.quick)){
                if(val.field_type.name=='lookupModel' || val.field_type.name=='picklist'){
                    if(_.isArray(values[val.name])){
                        result[val.name] = (!_.isEmpty(values[val.name]) && !_.isNull(values[val.name])) ? _.map(values[val.name],'_id') : null
                    }else{
                        result[val.name] = _.get(values,val.name+"._id",null)
                    }
                }else if(val.field_type.name=='date'){
    
                }else{
                    result[val.name] = _.trim(values[val.name])
                }
            }else{

            }
        }
    })
    return result
  }

  function transformFieldForSaving(value,field){
    console.log(field)
    if(field.field_type.name=='lookupModel' || field.field_type.name=='picklist'){
        if(_.isArray(value)){
            return (!_.isEmpty(value) && !_.isNull(value)) ? _.map(value,'_id') : null
        }else{
            return value._id
        }
    }else if(field.field_type.name=='date'){

    }else{
        return _.trim(value)
    }
  }

  function getAllHiddenFieldsAndPanels(panels,allfields,values,page){
    let hidden = {'fields':[],'panels':[]}
    _.forEach(panels, function(panel){
        let result = null
        if(!_.includes(panel.controllerMethod,'@show')){
            if(_.has(panel.rules,'hide_in')){
                if(_.includes(panel.rules.hide_in,page)){
                    result = true;
                }
            }
            if(_.has(panel.rules,'show_in')){
                if(!_.includes(panel.rules.show_in,page)){
                    result = true;
                }
            }
            if(_.get(panel,'rules.hide_if','') && result!=true){
                var parseresult = parseExpression(panel['rules']['hide_if'],panel.entityName,values)
                result = parseresult.value
            }
            if(_.get(panel,'rules.visible_if','') && result!=true){
                var parseresult = parseExpression(panel['rules']['visible_if'],panel.entityName,values)
                result = (parseresult.value) ? false : true
            }
            let panelFields = []
            _.forEach(panel.sections, function(section){
                let fields = (section.field_ids.length > 1) ? _.union(section.field_ids[0],section.field_ids[1]) : section.field_ids[0];
                panelFields = _.union(panelFields,_.filter(allfields,function(f){ if(_.includes(fields,f._id)){ return true; }}))
            })
            if(result===true){
                hidden.panels.push(panel.panelName)
                hidden.fields = _.union(hidden.fields, _.map(panelFields,'_id'))
             }else{
               let hFields = getHiddenFields(panelFields,panel.entityName,page,values)
               hidden.fields = _.union(hidden.fields, hFields)
             }
        }else{
            if(_.has(panel.rules,'hide_in')){
                if(_.includes(panel.rules.hide_in,page)){
                    hidden.panels.push(panel.panelName)
                }
            }
            if(_.has(panel.rules,'show_in')){
                if(!_.includes(panel.rules.show_in,page)){
                    hidden.panels.push(panel.panelName)
                }
            }
        }
    })
    return hidden
  }

  function getHiddenFields(fields,entityName,page,values){
    let hiddenFields = []
    _.forEach(fields, function(field){
        if(_.has(field.rules,'hide_in')){
            if(_.includes(field.rules.hide_in,page)){
                hiddenFields.push(field._id);
            }
        }
        if(_.has(field.rules,'show_in')){
            if(!_.includes(field.rules.show_in,page)){
                hiddenFields.push(field._id);
            }
        }
        if(_.get(field,'rules.hide_if','')){
            let result = parseExpression(field.rules.hide_if,entityName,values)
            if(result.value == true){
              hiddenFields.push(field._id);
            }else if(_.includes(hiddenFields,field._id)){
              _.pull(hiddenFields,field._id);
            }
        }
        if(_.get(field,'rules.visible_if','')){
            let result = parseExpression(field.rules.visible_if,entityName,values)
            if(result.value == false){
              hiddenFields.push(field._id);
            }else if(_.includes(hiddenFields,field._id)){
              _.pull(hiddenFields,field._id);
            }
        }
    })
    return _.uniq(hiddenFields)
  }

  function extractFieldinExpressionFormat(expression){
    var string = []
    var result = expression
      if(_.includes(result,'=>')){
        string = _.split(result,"=>")
        result = string[1]
      }
      if(_.includes(result,'::')){
        string = _.split(result,"::")
        result = string[1]
      }
      if(_.includes(result,':')){
        string = _.split(result,":")
        result = string[1]
      }
      if(_.includes(result,'.')){
        string = _.split(result,".")
        result = string[0]
      }
      return result
  }

  function extractEntityinExpressionFormat(expression){
    var string = []
    var result = expression
    if(_.includes(result,'=>')){
      string = _.split(result,"=>")
      result = string[1]
    }
    //console.log(result)
    //console.log(_.includes(result,'::'))
    if(_.includes(result,'::')){
      string = _.split(result,"::")
      result = string[0]
    }else if(_.includes(result,':')){
      string = _.split(result,":")
      result = string[0]
    }else{
      result = ""
    }
    return result
  }

  function controllingFieldChecker(field, fields, entity){
    let contolledFields = []
    let result = {'visible_if':[],'hide_if':[],'set_val_if':[],'set_val_disable_if':[],'filtered_by':[]}

    _.forEach(fields, function(f){
        let tokens = []

        if(_.has(f.rules,'visible_if')){
            tokens = pullAllFieldsInExpression(f.rules.visible_if)
            _.forEach(tokens, function(t){
                let e = extractEntityinExpressionFormat(_.chain(t).trimStart('{').trimEnd('}').value())
                let theField = extractFieldinExpressionFormat(_.chain(t).trimStart('{').trimEnd('}').value())
                if(e){
                    if(theField==field.name && entity==e && !_.includes(contolledFields,f.name)){
                        contolledFields.push(f.name)
                        result.visible_if.push({'field':f._id,'expression':f.rules.visible_if})
                    }
                }else if(theField==field.name && !_.includes(contolledFields,f.name)){
                    contolledFields.push(f.name)
                    result.visible_if.push({'field':f._id,'expression':f.rules.visible_if})
                }
            })
           
        }
        if(_.has(f.rules,'hide_if')){
            tokens = pullAllFieldsInExpression(f.rules.hide_if)
            _.forEach(tokens, function(t){
                let e = extractEntityinExpressionFormat(_.chain(t).trimStart('{').trimEnd('}').value())
                let theField = extractFieldinExpressionFormat(_.chain(t).trimStart('{').trimEnd('}').value())
                if(e){
                    if(theField==field.name && entity==e && !_.includes(contolledFields,f.name)){
                        contolledFields.push(f.name)
                        result.hide_if.push({'field':f._id,'expression':f.rules.hide_if})
                    }
                }else if(theField==field.name && !_.includes(contolledFields,f.name)){
                    contolledFields.push(f.name)
                    result.hide_if.push({'field':f._id,'expression':f.rules.hide_if})
                }
            })
        }
        if(_.has(f.rules,'set_val_if')){
            tokens = pullAllFieldsInExpression(f.rules.set_val_if.expression)
            _.forEach(tokens, function(t){
                let e = extractEntityinExpressionFormat(_.chain(t).trimStart('{').trimEnd('}').value())
                let theField = extractFieldinExpressionFormat(_.chain(t).trimStart('{').trimEnd('}').value())
                if(e){
                    if(theField==field.name && entity==e && !_.includes(contolledFields,f.name)){
                        contolledFields.push(f.name)
                        result.set_val_if.push({'field':f._id,'fieldName':f.name,'expression':f.rules.set_val_if.expression,'value':f.rules.set_val_if.value})
                    }
                }else if(theField==field.name && !_.includes(contolledFields,f.name)){
                    contolledFields.push(f.name)
                    result.set_val_if.push({'field':f._id,'fieldName':f.name,'expression':f.rules.set_val_if.expression,'value':f.rules.set_val_if.value})
                }
            })
        }
        if(_.has(f.rules,'set_val_disable_if')){
            tokens = pullAllFieldsInExpression(f.rules.set_val_disable_if.expression)
            _.forEach(tokens, function(t){
                let e = extractEntityinExpressionFormat(_.chain(t).trimStart('{').trimEnd('}').value())
                let theField = extractFieldinExpressionFormat(_.chain(t).trimStart('{').trimEnd('}').value())
                if(e){
                    if(theField==field.name && entity==e && !_.includes(contolledFields,f.name)){
                        contolledFields.push(f.name)
                        result.set_val_disable_if.push({'field':f._id,'fieldName':f.name,'expression':f.rules.set_val_disable_if.expression,'value':f.rules.set_val_disable_if.value})
                    }
                }else if(theField==field.name && !_.includes(contolledFields,f.name)){
                    contolledFields.push(f.name)
                    result.set_val_disable_if.push({'field':f._id,'fieldName':f.name,'expression':f.rules.set_val_disable_if.expression,'value':f.rules.set_val_disable_if.value})
                }
            })
        }
        if(_.has(f.rules,'filtered_by')){
            if(f.rules.filtered_by==field.name){
                if(!_.includes(result.filtered_by,f.name)){
                    result.filtered_by.push(f.name)
                }
            }
           
        }
        if(_.has(f,'filterQuery')){
            var filter = f.filterQuery;
            var query = filter.match(/(\%[a-zA-Z0-9_\:\.\#]*\%)/gi);
            _.forEach(query, function(q){
                var val = _.trim(q,'%')
                var fieldName = extractFieldinExpressionFormat(val)
                var entityName = extractEntityinExpressionFormat(val)
                if(_.isEmpty(entityName)){
                    entityName = entity
                }
                if(fieldName==field.name && entityName==entity){
                    if(!_.includes(result.filtered_by,f.name)){
                        result.filtered_by.push(f.name)
                    }
                }
            })
        }
       
    })
    return result
  }

  function parseHiddenFields(fieldsHidden,rules,entityName,values){
    let hiddenFields = _.cloneDeep(fieldsHidden)
    if(!_.isEmpty(rules.visible_if)){
        _.forEach(rules.visible_if,function(r){
            let result = parseExpression(r.expression,entityName,values)
            if(result.value == false){
              hiddenFields.push(r.field);
            }else if(_.includes(hiddenFields,r.field)){
              _.pull(hiddenFields,r.field);
            }
        })
    }
    if(!_.isEmpty(rules.hide_if)){
        _.forEach(rules.hide_if,function(r){
            let result = parseExpression(r.expression,entityName,values)
            if(result.value == true){
                hiddenFields.push(r.field);
              }else if(_.includes(hiddenFields,r.field)){
                _.pull(hiddenFields,r.field);
              }
        })
    }
    return hiddenFields
  }

  function getAllDisabledFields(fields,values,entityName,formPage){
    let disabledFields = []
    _.forEach(fields, function(field){
        if(_.has(field.rules,'hide_in')){
            if(_.includes(field.rules.hide_in,formPage)){
                disabledFields.push(field._id);
            }
        }
        if(_.has(field.rules,'show_in')){
            if(!_.includes(field.rules.show_in,formPage)){
                disabledFields.push(field._id);
            }
        }
        if(_.has(field.rules,'disable')){
            if(field.rules.disable){
                disabledFields.push(field._id);
            }
        }
        if(_.get(field,'rules.set_val_disable_if','')){
            let result = parseExpression(field.rules.set_val_disable_if.expression,entityName,values)
            if(result.value == true){
                disabledFields.push(field._id);
            }else if(_.includes(disabledFields,field._id)){
              _.pull(disabledFields,field._id);
            }
        }
    })
    return _.uniq(disabledFields)
  }


  function checkSetValRule(data,values,entityName){
    let value = {}
    if(_.isArray(data)){
        _.forEach(data, function(field){
            if(_.has(field.rules,'set_val_if')){
                let result = parseExpression(field.rules.set_val_if.expression,entityName,values)
                if(result.value == true){
                    value[field.name] = field.rules.set_val_if.value
                }
            }
            if(_.get(field,'rules.set_val_disable_if','')){
                let result = parseExpression(field.rules.set_val_disable_if.expression,entityName,values)
                if(result.value == true){
                    value[field.name] = field.rules.set_val_disable_if.value
                }
            }
        })
    }else{
        value = {'values':{}, 'disabled':[],'removeDisabled':[]}
        if(!_.isEmpty(data.set_val_if)){
            _.forEach(data.set_val_if,function(r){
                let result = parseExpression(r.expression,entityName,values)
                if(result.value == true){
                  value.values[r.fieldName] = r.value
                }
            })
        }
        if(!_.isEmpty(data.set_val_disable_if)){
            _.forEach(data.set_val_disable_if,function(r){
                let result = parseExpression(r.expression,entityName,values)
                if(result.value == true){
                    value.values[r.fieldName] = r.value
                    value.disabled.push(r.field)
                }else{
                    value.removeDisabled.push(r.field)
                }
            })
        }
    }

    return value
  }

  return {
    getPicklistFields,
    getLookupFields,
    transformFormValues,
    formatLookupOptions,
    transformNumberCurrency,
    transformDate,
    checkFieldIfMultipleSelect,
    getModuleValues,
    transformForSaving,
    transformFieldForSaving,
    getAllHiddenFieldsAndPanels,
    transformLookupValue,
    extractFieldinExpressionFormat,
    extractEntityinExpressionFormat,
    getDefaultValue,
    controllingFieldChecker,
    parseHiddenFields,
    getAllDisabledFields,
    checkSetValRule,
    transformLookupDisplay
  };
}