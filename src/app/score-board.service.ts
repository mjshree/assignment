import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScoreBoardService {
  public pinCount: number = 10;
  public frameNumber: number = 0;
  public rollNumber: number = 1;
  public frameScore: any[] = []
  public totalScore: number[] = [];
  public runningTotal: number[] = [];
  public bonus: string[] = []
  public bonusNextFrame: string[] = [];
  constructor() { 
    for (let index = 0; index < 10; index++) {
      this.frameScore.push([]);
      this.bonus.push('');
      this.bonusNextFrame.push('');
    }
  }

  throw(pinsHit: number) {
    this.rollNumber ++;
    this.pinCount -= pinsHit;
  };
  
  roll(pinsHit:number) {
    if (this.frameNumber === 9 && this.frameScore[this.frameNumber].length > 2){
      this.calculateScore();
      return;
    };
    if (pinsHit === 10 && this.rollNumber === 1) {
      this.frameScore[this.frameNumber].push("X");
      this.bonus[this.frameNumber] = 'Strike';
      this.bonusNextFrame[this.frameNumber +1] = 'StrikeFrame';
      this.nextFrame();
      return pinsHit;
    } else if((pinsHit + this.firstRollScore()[0]) === 10 && this.rollNumber > 1) {
      this.frameScore[this.frameNumber].push("/");
      this.bonus[this.frameNumber] = 'Spare';
      this.bonusNextFrame[this.frameNumber +1] = 'SpareFrame';
      this.nextFrame();
      return pinsHit;
    }
    else {
      this.throw(pinsHit);
      this.frameScore[this.frameNumber].push(pinsHit)
      if(this.bonus[this.frameNumber - 1] === 'Spare'|| this.bonus[this.frameNumber - 2] === 'Strike') {
        this.calculateScore();
      }
      if (this.isFrameComplete()){
        this.nextFrame();
      } else {
        return pinsHit;
      }
    }
    return;
  };
  
  isFrameComplete() {
    if(this.rollNumber > 2){
      return true;
    } else {
      return false;
    }
  };
  
  nextFrame() {
    const spareBonus = this.firstRollScore();
    if(this.frameNumber < 9) {
      this.frameNumber++;
    }
    this.rollReset();
    this.calculateScore();
  };
  
  rollReset() {
    this.rollNumber = 1;
    this.pinCount = 10;
  };
  
  firstRollScore() {
    return this.frameScore[this.frameNumber].slice(0,1)
  };
  
  calculateScore() {
    this.totalScore = [];
    this.runningTotal= [];
    let total = 0;
    let runningTotal = 0;
    for (let index = 0; index <= this.frameNumber-1; index++) {
      total = 0;
      if (this.bonus[index] === 'Strike'){
        if(this.frameScore[index+1] && ((this.frameScore[index+1].length > 0 && this.frameScore[index+1][0] === 'X') || this.frameScore[index+1].length > 1)) {
          if(this.frameScore[index+1][0] === 'X' && this.frameScore[index+2] && this.frameScore[index+2].length > 0) {
            total = 20 + (this.frameScore[index+2][0] === 'X' ? 10: this.frameScore[index+2][0]);
          } else if(this.frameScore[index+1][0] !== 'X') {
            total = 10 + (this.frameScore[index+1][1] === '/' ? 10: this.frameScore[index+1].reduce((a: number, b: number) => a+b, 0));
          } else if(this.frameScore[index+1].length > 2){
            total = 20 + (this.frameScore[index+1][1] === 'X' ? 10: this.frameScore[index+1][1]);
          } 
          else {
            return
          }
        }  else {
          return;
        }
      } else if(this.bonus[index] === 'Spare'){
        if(this.frameScore[index+1] && this.frameScore[index+1].length > 0) {
          total = 10 + (this.frameScore[index+1][0] === 'X' ? 10 : this.frameScore[index+1][0]);
        } else {
          return;
        }
      } 
      else{
         total = this.frameScore[index].reduce((a: number, b: number) => a+b, 0);
      }
      runningTotal = this.sumRunningTotal(runningTotal, total);
      if(this.frameNumber === 9 &&this.frameScore[index+1].length > 2) {
        total = 10 + ((this.frameScore[index+1][1] === 'X' || this.frameScore[index+1][1] === '/') ? 10: this.frameScore[index+1][1] )+((this.frameScore[index+1][2] === 'X') ? 10 : this.frameScore[index+1][2]);
        runningTotal = this.sumRunningTotal(runningTotal, total);
      } else if(this.frameNumber === 9 &&this.frameScore[index+1].length === 2 && !this.frameScore[index+1].some(isNaN)) {
        total = this.frameScore[index+1].reduce((a: number, b: number) => a+b, 0);
        runningTotal = this.sumRunningTotal(runningTotal, total);
      }
    }
    return total
  };

  sumRunningTotal(runningTotal: number, total: number) {
    runningTotal += total;
    this.runningTotal.push(runningTotal);
    this.totalScore.push(total);
    return runningTotal;
  }
}
