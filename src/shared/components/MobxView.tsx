import {observable} from "mobx";
import {getMobxPromiseGroupStatus} from "../lib/getMobxPromiseGroupStatus";

export type MobxView = {
    isComplete: boolean;
    isError: boolean;
    isPending: boolean;
} &
({
    status:"pending"|"error";
    component:ValidRender;
} | {
    status:"complete"
    component:JSX.Element;
});

type MobxView_await = ()=>({status:"complete"|"error"|"pending"}[]);
type MobxView_render = ()=>ValidRender
export type MobxViewAlwaysComponent = MobxView & { component:JSX.Element };
type ValidRender = JSX.Element|undefined|null;

export function MakeMobxView(params:{
    await: MobxView_await,
    render: MobxView_render,
    renderError:MobxView_render,
    renderPending:MobxView_render,
    showLastRenderWhenPending?:boolean
}):MobxViewAlwaysComponent;

export function MakeMobxView(params:{
    await: MobxView_await,
    render: MobxView_render,
    renderError?:MobxView_render,
    renderPending?:MobxView_render,
    showLastRenderWhenPending?:boolean
}):MobxView;

export function MakeMobxView(params:{
    await: MobxView_await,
    render: MobxView_render,
    renderError?:MobxView_render,
    renderPending?:MobxView_render,
    showLastRenderWhenPending?:boolean
}):MobxView {
    let hasRendered = false;
    let lastRender:ValidRender;

    return observable({
        get status() {
            const awaitElements = params.await();
            const promiseStatus = getMobxPromiseGroupStatus(...awaitElements) as any;
            return promiseStatus;
        },
        get isComplete() {
            return this.status === "complete";
        },
        get isError() {
            return this.status === "error";
        },
        get isPending() {
            return this.status === "pending";
        },
        get component() {
            let ret = undefined;
            switch (this.status) {
                case "complete":
                    ret = params.render();
                    hasRendered = true;
                    lastRender = ret;
                    break;
                case "pending":
                    if (params.showLastRenderWhenPending && hasRendered) {
                        ret = lastRender;
                    } else if (params.renderPending) {
                        ret = params.renderPending();
                    }
                    break;
                case "error":
                    if (params.renderError) {
                        ret = params.renderError();
                    }
                    break;
            }
            return ret;
        }
    });
}