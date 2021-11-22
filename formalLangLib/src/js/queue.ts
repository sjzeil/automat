class QNode<T> {
    constructor(data: T) {
        this.data = data;
        this.next = null;
    }

    data: T;
    next: QNode<T> | null;
}

export class Queue<T> {
    constructor () {
        this.first = null;
        this.last = null;
    }
    first: QNode<T> | null;
    last: QNode<T> | null;


    isEmpty(): boolean {
        return this.first == null;
    }

    push (data: T) {
        if (this.last == null) {
            this.first = this.last = new QNode<T>(data);
        } else {
            this.last = this.last.next = new QNode<T>(data);
        }
    }

    front(): T | null {
        if (this.first != null) {
            return this.first.data;
        } else {
            return null;
        }
    }

    pop() {
        if (this.first != null) {
            if (this.first == this.last) {
                this.first = this.last = null;
            } else {
                this.first = this.first.next;
            }
        }
    }

}