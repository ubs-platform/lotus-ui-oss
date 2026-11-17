export interface TaskInfo {
    status: "pending" | "running" | "completed" | "failed" | "";
}

export interface TaskWrapper {
    task: () => void;
    info: TaskInfo;
}

/** Ayni animation frame'e dusen gorevleri tek bir requestAnimationFrame cagrisinda toplar. */
export class AnimationScheduler {
    readonly tasks: Array<TaskWrapper> = [];
    isWorking = false;

    add(task: () => void): TaskWrapper {
        const taskWrap: TaskWrapper = { task, info: { status: "pending" } };
        this.tasks.push(taskWrap);

        if (!this.isWorking) {
            this.isWorking = true;

            const runner = (): void => {
                while (this.tasks.length > 0) {
                    const currentTaskWrapper = this.tasks.shift();
                    if (currentTaskWrapper) {
                        currentTaskWrapper.info.status = "running";
                        try {
                            currentTaskWrapper.task();
                            currentTaskWrapper.info.status = "completed";
                        } catch {
                            currentTaskWrapper.info.status = "failed";
                        }
                    }
                }
                this.isWorking = false;
            };

            if (typeof requestAnimationFrame === "function") {
                requestAnimationFrame(runner);
            } else {
                console.warn("requestAnimationFrame is not available. Tasks will be executed manually and synchronously");
                runner();
            }
        }

        return taskWrap;
    }

    static readonly singleton = new AnimationScheduler();
}
