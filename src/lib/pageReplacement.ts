export interface PageReplacementStep {
  step: number;
  page: number;
  frames: number[];
  fault: boolean;
}

export interface PageReplacementResult {
  pageFaults: number;
  pageHits: number;
  steps: PageReplacementStep[];
  hitRate: number;
}

// FIFO Page Replacement Algorithm
export function fifoPageReplacement(pages: number[], framesCount: number): PageReplacementResult {
  const frames: number[] = [];
  let pageFaults = 0;
  let pageHits = 0;
  const steps: PageReplacementStep[] = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const isFault = !frames.includes(page);

    if (isFault) {
      // Page Fault occurs
      if (frames.length < framesCount) {
        frames.push(page);
      } else {
        frames.shift(); // Remove first page (FIFO)
        frames.push(page);
      }
      pageFaults++;
    } else {
      pageHits++;
    }

    steps.push({
      step: i + 1,
      page,
      frames: [...frames],
      fault: isFault
    });
  }

  const hitRate = (pageHits / pages.length) * 100;

  return { pageFaults, pageHits, steps, hitRate };
}

// LRU (Least Recently Used) Page Replacement Algorithm
export function lruPageReplacement(pages: number[], framesCount: number): PageReplacementResult {
  const frames: number[] = [];
  const recent = new Map<number, number>();
  let pageFaults = 0;
  let pageHits = 0;
  const steps: PageReplacementStep[] = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const isFault = !frames.includes(page);

    if (isFault) {
      if (frames.length < framesCount) {
        frames.push(page);
      } else {
        // Find least recently used page
        const lruPage = Array.from(recent.entries()).sort((a, b) => a[1] - b[1])[0][0];
        const lruIndex = frames.indexOf(lruPage);
        frames[lruIndex] = page;
        recent.delete(lruPage);
      }
      pageFaults++;
    } else {
      pageHits++;
    }

    // Update recent usage
    recent.set(page, i);

    steps.push({
      step: i + 1,
      page,
      frames: [...frames],
      fault: isFault
    });
  }

  const hitRate = (pageHits / pages.length) * 100;

  return { pageFaults, pageHits, steps, hitRate };
}

// Optimal Page Replacement Algorithm
export function optimalPageReplacement(pages: number[], framesCount: number): PageReplacementResult {
  const frames: number[] = [];
  let pageFaults = 0;
  let pageHits = 0;
  const steps: PageReplacementStep[] = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const isFault = !frames.includes(page);

    if (isFault) {
      if (frames.length < framesCount) {
        frames.push(page);
      } else {
        // Predict future use of each frame
        const futureIndexes = frames.map(f => {
          const nextUse = pages.slice(i + 1).indexOf(f);
          return nextUse === -1 ? Infinity : nextUse;
        });
        const indexToReplace = futureIndexes.indexOf(Math.max(...futureIndexes));
        frames[indexToReplace] = page;
      }
      pageFaults++;
    } else {
      pageHits++;
    }

    steps.push({
      step: i + 1,
      page,
      frames: [...frames],
      fault: isFault
    });
  }

  const hitRate = (pageHits / pages.length) * 100;

  return { pageFaults, pageHits, steps, hitRate };
}
