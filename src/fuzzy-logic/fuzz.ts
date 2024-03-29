﻿import Helper from './Helper';

class Fuzz {
    helper = new Helper();
    /// <summary>
    /// Logic AND returns possibility of all events in the same time
    /// </summary>
    And = (eventsPossibility: number[]) => {
        this.helper.OutOfRangeCheck(eventsPossibility);

        var mnoj = eventsPossibility.reduce((p, x, index) => {
            if (index === 0) {
                return x;
            } else {
                return p * x;
            }
        });

        return mnoj;
    }

    /// <summary>
    /// returns possibility of any of events
    /// </summary>
    Or = (eventsPossibility: number[]) => {
        this.helper.OutOfRangeCheck(eventsPossibility);

        var summ = eventsPossibility.reduce((p, x) => p + x, 0);

        return summ / eventsPossibility.length;
    }

    /// <summary>
    /// Returns IMpossibility of any of events
    /// </summary>
    /// <param name="eventsPossibility"></param>
    Not = (eventsPossibility: number[]) => {
        return 1.0 - this.Or(eventsPossibility);
    }
}

export default Fuzz;
