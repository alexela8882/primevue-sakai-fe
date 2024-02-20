import { ref } from 'vue';
import _ from 'lodash';
export default function helper() {

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
    console.log(options)
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
                    res[index]['options'].push(_.merge(val,{'value':val.name}))
                }else{
                    res.push({'label':category,'options':[_.merge(val,{'value':val.name})]})
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

  function transformFormValues(fields,formPage){
    return _.reduce(fields, function(res,val,i){
        if(val.field_type.name=='number' || val.field_type.name=='percentage' || val.field_type.name=='currency') {
            res[val.name] = 0
        }else if(val.field_type.name=='boolean'){
            res[val.name] = false
        }else if(_.get(val.rules,'ms_dropdown',false) || _.get(val.rules,'ms_pop_up',false) || (_.get(val.rules,'checkbox',false) && val.field_type.name=='lookupModel')){
            res[val.name] = ['5a7ff2c8678f716be22b37f3']
        }else{
            res[val.name] = null
        }
        return res
    },{})
  }


  return {
    getPicklistFields,
    getLookupFields,
    transformFormValues,
    formatLookupOptions,
  };
}