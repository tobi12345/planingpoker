export interface RedisConfig {
	host: string
	port: number
}

export interface IBaseConfig {
	redis: RedisConfig
	instanceID: string
}
