import { createClient } from '@supabase/supabase-js'
import { fakerZH_TW as faker } from '@faker-js/faker'
import 'dotenv/config'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
  auth: { persistSession: false }
})
const categories = ['food', 'bill', 'transportation', 'entertainment']

// 取得所有的使用者
const {
  data: { users },
  error
} = await supabase.auth.admin.listUsers()

// 取得使用者的系統編號
const userIds = users?.map((user) => user.id)

async function seedTransactions() {
  // 清空現有資料，清除所有 id > 0
  const { error: deleteError } = await supabase.from('transactions').delete().gte('id', 0)

  if (deleteError) {
    console.error('Error deleting existing data:', deleteError)
    return
  }

  let transactions = []

  for (const user of userIds) {
    for (let year = new Date().getFullYear(); year > new Date().getFullYear() - 2; year--) {
      for (let i = 0; i < 10; i++) {
        const date = new Date(
          year,
          faker.number.int({ min: 0, max: 11 }),
          faker.number.int({ min: 1, max: 28 })
        )

        let type, category
        const typeBias = Math.random()

        // 70% 為花費
        if (typeBias < 0.7) {
          type = 'Expense'
          // 只有花費才有分類
          category = faker.helpers.arrayElement(categories)
        } else if (typeBias < 0.9) {
          // 20% 為所得
          type = 'Income'
        } else {
          // 其餘為儲蓄和投資
          type = faker.helpers.arrayElement(['Saving', 'Investment'])
        }

        let amount
        switch (type) {
          case 'Income':
            amount = faker.number.int({ min: 2000, max: 5000 })
            break
          case 'Expense':
            amount = faker.number.int({ min: 100, max: 1000 })
            break
          case 'Saving':
          case 'Investment':
            amount = faker.number.int({ min: 5000, max: 10000 })
            break
          default:
            amount = 0
        }

        transactions.push({
          created_at: date,
          amount,
          type,
          description: faker.lorem.sentence(),
          // 只有花費才有分類
          category: type === 'Expense' ? category : null,
          user_id: user
        })
      }
    }
  }

  // upsert: 結合 insert & update
  const { error: insertError } = await supabase.from('transactions').upsert(transactions)

  if (insertError) {
    console.error('Error inserting data:', insertError)
  } else {
    console.log('Data inserted successfully.')
  }
}

seedTransactions().catch(console.error)
