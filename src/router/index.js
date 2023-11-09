import { toRef } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import auth from '@/middleware/auth'
import axios from 'axios'
import NProgress from 'nprogress'
// components
import AppLayout from '@/layout/AppLayout.vue'
// stores & composables
import { useLayout } from '@/layout/composables/layout'
import { useBaseComposables } from '@/composables/base'

// refs
// stores & components
const { layoutConfig, changeThemeSettings } = useLayout()
const { routerLoading } = useBaseComposables()

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: {
            requiresAuth: true
          }
        }, {
          path: '/users',
          name: 'users',
          component: () => import('@/views/pages/users/main.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              name: 'users.index',
              component: () => import('@/views/pages/users/index.vue'),
            }, {
              path: ':id',
              name: 'users.view',
              component: () => import('@/views/pages/users/view.vue')
            }
          ]
        }, {
          path: '/modules',
          name: 'modules',
          component: () => import('@/views/pages/modules/main.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              name: 'modules.index',
              component: () => import('@/views/pages/modules/index.vue'),
            }, {
              path: ':name/:id',
              name: 'modules.view',
              component: () => import('@/views/pages/modules/view.vue')
            }, {
              path: ':name/:id/detail-page/:pageid',
              name: 'modules.detail_page',
              component: () => import('@/views/pages/modules/pages/detail.vue')
            }
          ]
        }, {
          path: '/branches',
          name: 'branches',
          component: () => import('@/views/pages/branches/main.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              name: 'branches.index',
              component: () => import('@/views/pages/branches/index.vue'),
            }, {
              path: ':id',
              name: 'branches.view',
              component: () => import('@/views/pages/branches/view.vue')
            }
          ]
        }, {
          path: '/countries',
          name: 'countries',
          component: () => import('@/views/pages/countries/index.vue'),
          meta: {
            requiresAuth: true
          }
        }, {
          path: '/uikit/formlayout',
          name: 'formlayout',
          component: () => import('@/views/uikit/FormLayout.vue'),
          meta: {
            requiresAuth: true
          }
        }, {
          path: '/uikit/input',
          name: 'input',
          component: () => import('@/views/uikit/Input.vue')
        }, {
          path: '/uikit/floatlabel',
          name: 'floatlabel',
          component: () => import('@/views/uikit/FloatLabel.vue')
        }, {
          path: '/uikit/invalidstate',
          name: 'invalidstate',
          component: () => import('@/views/uikit/InvalidState.vue')
        }, {
          path: '/uikit/button',
          name: 'button',
          component: () => import('@/views/uikit/Button.vue')
        }, {
          path: '/uikit/table',
          name: 'table',
          component: () => import('@/views/uikit/Table.vue')
        }, {
          path: '/uikit/list',
          name: 'list',
          component: () => import('@/views/uikit/List.vue')
        }, {
          path: '/uikit/tree',
          name: 'tree',
          component: () => import('@/views/uikit/Tree.vue')
        }, {
          path: '/uikit/panel',
          name: 'panel',
          component: () => import('@/views/uikit/Panels.vue')
        }, {
          path: '/uikit/overlay',
          name: 'overlay',
          component: () => import('@/views/uikit/Overlay.vue')
        }, {
          path: '/uikit/media',
          name: 'media',
          component: () => import('@/views/uikit/Media.vue')
        }, {
          path: '/uikit/menu',
          component: () => import('@/views/uikit/Menu.vue'),
          children: [
            {
              path: '/uikit/menu',
              component: () => import('@/views/uikit/menu/PersonalDemo.vue')
            }, {
              path: '/uikit/menu/seat',
              component: () => import('@/views/uikit/menu/SeatDemo.vue')
            }, {
              path: '/uikit/menu/payment',
              component: () => import('@/views/uikit/menu/PaymentDemo.vue')
            }, {
              path: '/uikit/menu/confirmation',
              component: () => import('@/views/uikit/menu/ConfirmationDemo.vue')
            }
          ]
        }, {
          path: '/uikit/message',
          name: 'message',
          component: () => import('@/views/uikit/Messages.vue')
        }, {
          path: '/uikit/file',
          name: 'file',
          component: () => import('@/views/uikit/File.vue')
        }, {
          path: '/uikit/charts',
          name: 'charts',
          component: () => import('@/views/uikit/Chart.vue')
        }, {
          path: '/uikit/misc',
          name: 'misc',
          component: () => import('@/views/uikit/Misc.vue')
        }, {
          path: '/blocks',
          name: 'blocks',
          component: () => import('@/views/utilities/Blocks.vue')
        }, {
          path: '/utilities/icons',
          name: 'icons',
          component: () => import('@/views/utilities/Icons.vue')
        }, {
          path: '/pages/timeline',
          name: 'timeline',
          component: () => import('@/views/pages/Timeline.vue')
        }, {
          path: '/pages/empty',
          name: 'empty',
          component: () => import('@/views/pages/Empty.vue')
        }, {
          path: '/pages/crud',
          name: 'crud',
          component: () => import('@/views/pages/Crud.vue')
        }, {
          path: '/documentation',
          name: 'documentation',
          component: () => import('@/views/utilities/Documentation.vue')
        }
      ]
    }, {
      path: '/landing',
      name: 'landing',
      component: () => import('@/views/pages/Landing.vue')
    }, {
      path: '/pages/notfound',
      name: 'notfound',
      component: () => import('@/views/pages/NotFound.vue')
    }, {
      path: '/auth/access',
      name: 'accessDenied',
      component: () => import('@/views/pages/auth/Access.vue')
    }, {
      path: '/auth/error',
      name: 'error',
      component: () => import('@/views/pages/auth/Error.vue')
    }, {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/views/pages/auth/Login.vue'),
      beforeEnter(to, from, next) {
        const isAuthenticated = localStorage.getItem('isAuthenticated')

        if (isAuthenticated) router.push('/')
        else next()
      }
    },
  ]
});

router.beforeEach((to, from) => {
  // instead of having to check every route record with
  // to.matched.some(record => record.meta.requiresAuth)
  console.log('router loading...')
  routerLoading.value = true
  NProgress.start()

  // fix for first time log in
  axios.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`

  const isAuthenticated = localStorage.getItem('isAuthenticated')

  axios.get('/user-configs/get-app-theme').then((response) => {
    // theme
    const elementId = 'theme-css'
    const linkElement = document.getElementById(elementId)
    const cloneLinkElement = linkElement.cloneNode(true)
    const newThemeUrl = linkElement.getAttribute('href').replace(layoutConfig.theme.value, response.data.app_theme)
    cloneLinkElement.setAttribute('id', elementId + '-clone')
    cloneLinkElement.setAttribute('href', newThemeUrl)
    cloneLinkElement.addEventListener('load', () => {
      linkElement.remove()
      cloneLinkElement.setAttribute('id', elementId)
      changeThemeSettings(response.data.app_theme, layoutConfig.darkTheme.value)
    })
    linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling)

    // theme scale
    document.documentElement.style.fontSize = response.data.app_theme_scale + 'px'

    // theme ripple
    layoutConfig.ripple.value = response.data.app_theme_ripple

    // theme menu type
    layoutConfig.menuMode.value = response.data.app_theme_menu_type

    // theme input style
    layoutConfig.inputStyle.value = response.data.app_theme_input_stype

    console.log(layoutConfig)
  }).catch((err) => {
    console.log(err)

    layoutConfig.theme.value = localStorage.getItem('layoutConfig.theme')
    layoutConfig.darkTheme.value = localStorage.getItem('layoutConfig.darkTheme')
    layoutConfig.scale.value = localStorage.getItem('layoutConfig.scale')
    layoutConfig.ripple.value = localStorage.getItem('layoutConfig.ripple')
    layoutConfig.menuMode.value = localStorage.getItem('layoutConfig.menuMode')
    layoutConfig.inputStyle.value = localStorage.getItem('layoutConfig.inputStyle')

    const elementId = 'theme-css'
    const linkElement = document.getElementById(elementId)
    const cloneLinkElement = linkElement.cloneNode(true)
    const newThemeUrl = linkElement.getAttribute('href').replace('lara-light-indigo', layoutConfig.theme.value)
    cloneLinkElement.setAttribute('id', elementId + '-clone')
    cloneLinkElement.setAttribute('href', newThemeUrl)
    cloneLinkElement.addEventListener('load', () => {
      linkElement.remove()
      cloneLinkElement.setAttribute('id', elementId)
      changeThemeSettings(layoutConfig.theme.value, layoutConfig.darkTheme.value === 'dark')
    })
    linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling)

    // theme scale
    document.documentElement.style.fontSize = layoutConfig.scale.value + 'px'

    // theme ripple
    layoutConfig.ripple.value = layoutConfig.ripple.value

    // theme menu type
    layoutConfig.menuMode.value = layoutConfig.menuMode.value

    // theme input style
    layoutConfig.inputStyle.value = layoutConfig.inputStyle.value
  })

  if (to.meta.requiresAuth && !isAuthenticated) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      name: 'login',
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    }
  }
});

router.afterEach((to, from) => {
  console.log('router loaded!')
  routerLoading.value = false
  NProgress.done()
});

export default router;
