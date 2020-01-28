import { Component } from '@angular/core';
import { AlertService } from './alert/alert.component';

export enum ListOperation {
  Addition = 0,
  Difference = 1,
  Product = 2,
  Quotient = 3
}

@Component({
  selector: 'app-root',
  templateUrl: './app.calculator.html',
  styleUrls: ['./app.calculator.css']
})
export class AppCalculator {
  title = 'Angular Calculator';
  public isHide: boolean;
  public result:string;     // *** If we use 'this' we must have a class level declaration.
  public Operand1_Sum:string;   // *** Same as above.
  public Operand2_Sum:string;   // *** Same as above.
  public Operand1_Diff:string;   // *** Same as above.
  public Operand2_Diff:string;
  public Operand1_Prod:string;   // *** Same as above.
  public Operand2_Prod:string;
  public Operand1_Quot:string;   // *** Same as above.
  public Operand2_Quot:string;

  public selectedOperation: ListOperation;

  Operations =  ListOperation;

  constructor(private alertService: AlertService){
    this.selectedOperation = null;
    this.isHide = true;
  }

  error(message: string) {
    this.alertService.error(message);
  }

  clear() {
    this.alertService.clear();
  }

  doAddition() {
    
    this.selectedOperation = ListOperation.Addition;
    if(!this.doValidation(this.Operand1_Sum,this.Operand2_Sum, this.selectedOperation)){
      return;
    }
    
    this.doShowHide(false);
    this.result= `${Number(this.Operand1_Sum)} + ${Number(this.Operand2_Sum)} =  ${Number(this.Operand1_Sum) + Number(this.Operand2_Sum)}`;
    this.clean();
  };

  doDifference(){
    this.selectedOperation = ListOperation.Difference;

    if(!this.doValidation(this.Operand1_Diff,this.Operand2_Diff, this.selectedOperation)){
      return;
    }
    
    this.doShowHide(false);
    this.result = `${Number(this.Operand1_Diff)} - ${Number(this.Operand2_Diff)} = ${Number(this.Operand1_Diff) - Number(this.Operand2_Diff)}`;
    this.clean();
  };

  doProduct(){
    this.selectedOperation = ListOperation.Product;

    if(!this.doValidation(this.Operand1_Prod,this.Operand2_Prod, this.selectedOperation)){
      return;
    }
    
    this.doShowHide(false);
    this.result = `${Number(this.Operand1_Prod)} * ${Number(this.Operand2_Prod)} = ${Number(this.Operand1_Prod) * Number(this.Operand2_Prod)}`;
    this.clean();
  };

  doQuotient(){
    this.selectedOperation = ListOperation.Quotient;

    if(!this.doValidation(this.Operand1_Quot,this.Operand2_Quot, this.selectedOperation)){
      return;
    }
    
    this.doShowHide(false);
    this.result = `${Number(this.Operand1_Quot)} / ${Number(this.Operand2_Quot)} = ${Number(this.Operand1_Quot) / Number(this.Operand2_Quot)}`;
    this.clear();
  };

  doShowHide(hide : boolean){
      this.isHide = hide;
  }

  doValidation(val1:string, val2: string, operation: ListOperation){
    if(operation == this.Operations.Quotient && Number(val2) == 0){
      this.error("It is not possible do division by 0.");
      return false;
    }
    else if(typeof val1 === 'undefined' || val1.length == 0){
      this.error("Please fill out the first operand.");
      return false;
    }
    else if(typeof val2 === 'undefined' || val2.length == 0){
      this.error("Please fill out the second operand.");
      return false;
    }

    this.clear();
    return true;

  }

  clean(){
    this.Operand1_Sum = "";
    this.Operand2_Sum = "";
    this.Operand1_Diff = "";
    this.Operand2_Diff = "";
    this.Operand1_Prod = "";
    this.Operand2_Prod = "";
    this.Operand1_Quot = "";
    this.Operand2_Quot = "";
  }

}
