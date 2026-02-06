import mitt from "mitt";

type ApplicationEvents = {
	"auth:login": void;
};

const emitter = mitt<ApplicationEvents>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;
