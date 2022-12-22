import { Component } from '@angular/core';
import { ScoreBoardService } from './score-board.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'bowling-scoreboard';
  public firstRoll: number = 0;
  public runScore: number = 0;
  public frame: any[] = [];
  public marker: any[] = [];
  constructor(private scoreBoardService: ScoreBoardService) {}
  pinHit(pins: number) {
    this.scoreBoardService.roll(pins);
    this.frameScore();
    this.totalScore();
  }

  hideButton(num: number): boolean {
    if (this.frame.length) {
      const frameData =
        this.frame[this.scoreBoardService.frameNumber].split(',');
      if (frameData[0] !== 'X' && !(this.scoreBoardService.frameNumber === 9 && frameData[1] === '/')) {
        const sum = 10 - frameData.reduce((a: number, b: number) => a + b, 0);
        return sum >= num;
      }
    }
    return true;
  }
  
  frameScore() {
    this.frame = [];
    for (let index = 0; index < 10; index++) {
      this.frame.push(this.scoreBoardService.frameScore[index].join());
    }
  }

  totalScore() {
    this.marker = [];
    const runScore = this.scoreBoardService.runningTotal;
    for (let i = 0; i < this.scoreBoardService.runningTotal.length; i++) {
      if (runScore[i]) {
        this.marker.push(runScore[i]);
      }
    }
  }

  getFinalTotal() {
    return this.scoreBoardService.runningTotal &&
      this.scoreBoardService.runningTotal.length
      ? this.scoreBoardService.runningTotal[
          this.scoreBoardService.runningTotal.length - 1
        ]
      : 0;
  }

  replay() {
    window.location.reload();
  }
}
