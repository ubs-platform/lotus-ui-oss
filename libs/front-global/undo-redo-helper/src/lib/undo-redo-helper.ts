// import { DynamicQueue } from '@lotus/common-global/dynamic-queue';
import { DynamicQueue, QueueOrder } from '@ubs-platform/dynamic-queue';
import { ReplaySubject, Subject } from 'rxjs';

export interface Operation {
  revert(): Promise<void>;
  apply(): Promise<void>;
}

export class UndoRedoHelper {
  private dynamicQueue = new DynamicQueue();
  private operationsHistory: Array<Operation> = [];
  private operationReverted: Array<Operation> = [];
  private _canRedoSubscription = new ReplaySubject<boolean>(1);
  private _canUndoSubscription = new ReplaySubject<boolean>(1);

  // public app
  public pushOperationQueue(
    operation: Operation,
    clearRedoList: boolean,
    runApply = true
  ) {
    this.dynamicQueue.push(
      new Promise<void>(async (ok, fail) => {
        await this.insertOperation(operation, runApply, clearRedoList);
        ok();
      })
    );
  }

  public get canRedo() {
    return this._canRedoSubscription;
  }
  public get canUndo() {
    return this._canUndoSubscription;
  }

  updateAbilities() {
    this._canUndoSubscription.next(this.operationsHistory.length > 0);
    this._canRedoSubscription.next(this.operationReverted.length > 0);
  }

  private async insertOperation(
    operation: Operation,
    runApply: boolean,
    clearRedoList: boolean
  ) {
    this.operationsHistory.push(operation);
    if (runApply) {
      await operation.apply();
    }

    if (clearRedoList) {
      this.operationReverted = [];
      this.updateAbilities();
    }
  }

  public undo(): void {
    if (!this.dynamicQueue.busy) {
      this.dynamicQueue.push(
        new Promise<void>(async (ok, fail) => {
          await this.undoPure();

          ok();
        })
      );
    }
  }

  private async undoPure() {
    if (this.operationsHistory.length > 0) {
      const operation = this.operationsHistory.pop();
      if (operation) {
        await operation.revert();

        this.operationReverted.push(operation);
        this.updateAbilities();
      }
    }
  }

  public async redo() {
    if (!this.dynamicQueue.busy) {
      this.dynamicQueue.push(
        new Promise<void>(async (ok, fail) => {
          await this.redoPure();

          ok();
        })
      );
    }
  }

  private async redoPure() {
    if (this.operationReverted.length > 0) {
      const operation = this.operationReverted.pop();

      if (operation) {
        await operation.apply();
        this.operationsHistory.push(operation);
        this.updateAbilities();
      }
    }
  }

  public async reset() {
    this.dynamicQueue.push(
      new Promise<void>(async (ok, fail) => {
        await this.resetPure();

        ok();
      })
    );
  }

  private async resetPure() {
    this.operationsHistory = [];
    this.operationReverted = [];
    this.updateAbilities();
  }
}
