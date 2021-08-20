import { User } from './user'
import { Asset } from './asset'
import { Snapshot } from './snapshot'
export interface Payment {
  recipient: User
  asset: Asset
  asset_id: string
  amount: string
  trace_id: string
  status: string
  memo: string
  receivers: string
  threshold: string
  code_id: string
}

export interface Transfer {
}

export interface RawTransaction {
  type: string
  snapshot: string
  opponent_key: string
  asset_id: string
  amount: string
  trace_id: string
  memo: string
  state: string
  created_at: string
  transaction_hash: string
  snapshot_hash: string
  snapshot_at: string
}


export interface TransferInput {
  asset_id: string
  opponent_id?: string
  amount?: string
  trace_id?: string
  memo?: string

  // OpponentKey used for raw transaction
  opponent_key?: string
  opponent_multisig?: {
    receivers: string[]
    threshold: number
  }

  pin?: string
}

export interface GhostKeys {
  mask: string
  keys: string[]
}

export interface GhostInput {
  receivers: string[]
  index: number
  hint: string
}


export interface WithdrawInput {
  asset_id: string
  amount: string
  trace_id?: string
  memo?: string

  pin?: string
}

export interface TransferClientRequest {
  verifyPayment(params: TransferInput): Promise<Payment>
  transfer(params: TransferInput, pin?: string): Promise<Snapshot>
  readTransfer(trace_id: string): Promise<Snapshot>
  transaction(params: TransferInput, pin?: string): Promise<RawTransaction>
  readGhostKeys(receivers: string[], index: number): Promise<GhostKeys>
  batchReadGhostKeys(input: GhostInput[]): Promise<GhostKeys[]>
  withdraw(params: WithdrawInput, pin?: string): Promise<Snapshot>
}